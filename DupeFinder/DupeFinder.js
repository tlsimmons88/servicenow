var DupeFinder = Class.create();
DupeFinder.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    //Undocumented way to use the built in initialize method found in non-ajax script includes
    initialize: function (request, responseXML, gc) {
        global.AbstractAjaxProcessor.prototype.initialize.call(this, request, responseXML, gc);
        this.tableName = false;
        this.fieldName = false;
        this.listOfClassNames = false;
        this.additionalFilter = false;
    },

    //Method to return an array of values that match the field name given on the table given
    //@Param 1:  tableName = name of table to search
    //@Param 2:  fieldName = name of field to search for dupes of
    //@Return:   listOfDupeFieldValues = Array of values where dupes were found
    //@Example:  name is one of listOfDupeFieldValues
    getListOfFieldValuesThatHaveDupes: function(tableName, fieldName) {  
        this.tableName = this._getTableName(tableName);
        this.fieldName = this._getFieldName(fieldName);
        var listOfDupeFieldValues = [];

        if(this.tableName && this.fieldName) {
            var gaDupe = new GlideAggregate(this.tableName); 
            //aggregate to count values in whatever field is passed as fieldName
            gaDupe.addAggregate('COUNT', this.fieldName); 
            //returns only records having more than one active instance of fieldName (duplicates)
            gaDupe.addHaving('COUNT', this.fieldName, '>', '1'); 
            gaDupe.query();  
           
            while(gaDupe.next()) {  
                listOfDupeFieldValues.push(gaDupe.getValue(this.fieldName));    
            } 
            
        }
		return listOfDupeFieldValues; 
        
    },

    //Method to return an array of sys_ids that match the field name given on the table given
    //@Param 1:  tableName = name of table to search
    //@Param 2:  fieldName = name of field to search for dupes of
    //@Param 3:  additionalFilter (optional) = adds more filtering/query after the sys_id is one of 
    //@Return:   listOfDupeRecordSysIds = Array of sys_ids where dupes were found AND (due to additional filter) encoded query string
    //@Example:  sys_id is one of listOfDupeRecordSysIds AND additionalFilter
    getListOfDupeRecordSysIdsByFieldName:  function(tableName, fieldName, additionalFilter) {
        var listOfDupeFieldValues = this.getListOfFieldValuesThatHaveDupes(tableName, fieldName);
        var listOfDupeRecordSysIds = [];

        if(listOfDupeFieldValues.length > 0) {
            this.additionalFilter = this._getAdditionalFilter(additionalFilter);
            var grDupeRecord = new GlideRecord(this.tableName);
            grDupeRecord.addQuery(this.fieldName, 'IN', listOfDupeFieldValues);
            if(this.additionalFilter) {
                grDupeRecord.addEncodedQuery('^' + this.additionalFilter);
            }
            grDupeRecord.query();

            while(grDupeRecord.next()) {
                listOfDupeRecordSysIds.push(grDupeRecord.getValue('sys_id'));
            }
        }
        return listOfDupeRecordSysIds;
    },

    //Method to return an array of sys_ids that match the field name given on the table given where the ci is Referenced on one of the classes passed in
    //@Param 1:  tableName = name of table to search
    //@Param 2:  fieldName = name of field to search for dupes of
    //@Param 3:  listOfClassNames = comma seperated list of classes to check
    //@Param 4:  additionalFilter (optional) = adds more filtering/query after the sys_id is one of 
    //@Return:   listOfDupeRecordSysIdsReferencedByClass = Array of sys_ids where dupes were found AND (due to additional filter) encoded query string
    //@Example:  sys_id is one of listOfDupeRecordSysIdsReferencedByClass AND additionalFilter
    //@Use Case: Give me all dupe ci's that are Referenced on an incident and change request ticket where the dupe is not retired
    getListOfDupeRecordSysIdsReferencedByClassName:  function(tableName, fieldName, listOfClassNames, additionalFilter) {
        this.listOfClassNames = this._getLisOfClassNames(listOfClassNames);
        var listOfDupeRecordSysIds = this.getListOfDupeRecordSysIdsByFieldName(tableName, fieldName, additionalFilter);
        var listOfDupeRecordSysIdsReferencedByClass = [];
        var listOfClassNamesLength = this.listOfClassNames.length;
        var listOfCiColumnNames = this._getListColumnNamesReferencedByTable('cmdb_ci');
        var listOfCiColumnNamesLength = listOfCiColumnNames.length;
        
        if(listOfDupeRecordSysIds.length > 0  &&  listOfClassNamesLength > 0 && listOfCiColumnNamesLength > 0) {
            var i;
            //Loops through each class given
            for(i = 0; i < listOfClassNamesLength; i++) {
                //Setting back to 0 here so on the next class loop it starts the column search over
                var j = 0;
                
                //Loops though each column name that configuration item is a refrence of
                for(j = 0; j < listOfCiColumnNamesLength; j++) {
                    //Is true when the curent GlideRecord Table has a matching "ci" column on it
                    if(this._doesTableHaveConfigurationItemColumn(this.listOfClassNames[i], listOfCiColumnNames[j])) {
                        //Have to re-init the grReferencedRecord every loop to ensure the query is reset every time.  Otherwise each loop just appended to the previous query
                        var grReferencedRecord = new GlideRecord(this.listOfClassNames[i]);
                        grReferencedRecord.addQuery(listOfCiColumnNames[j], 'IN', listOfDupeRecordSysIds);
                        grReferencedRecord.query();

                        while(grReferencedRecord.next()) {
                            listOfDupeRecordSysIdsReferencedByClass.push(grReferencedRecord.getValue(listOfCiColumnNames[j]));
                        }
                    }
                }
            }
        }
        return listOfDupeRecordSysIdsReferencedByClass;
    },

    //Method to return an array of sys_ids that match the field name given on the table given where the ci is NOT Referenced on one of the classes passed in
    //@Param 1:  tableName = name of table to search
    //@Param 2:  fieldName = name of field to search for dupes of
    //@Param 3:  listOfClassNames = comma seperated list of classes to check
    //@Param 4:  additionalFilter (optional) = adds more filtering/query after the sys_id is one of
    //@Return:   listOfDupeRecordSysIdsNotReferencedByClass = Array of sys_ids where dupes were found AND (due to additional filter) encoded query string
    //@Example:  sys_id is one of listOfDupeRecordSysIdsNotReferencedByClass AND additionalFilter
    //@Use Case: Give me all dupe ci's that are NOT Referenced on an incident and change request ticket where the dupe is not retired
    getListOfDupeRecordSysIdsNotReferencedByClassName: function(tableName, fieldName, listOfClassNames, additionalFilter) {
        var listOfDupeRecordSysIdsNotReferencedByClass = [];
        var listOfDupeRecordSysIds = this.getListOfDupeRecordSysIdsByFieldName(tableName, fieldName, additionalFilter);

        if(listOfDupeRecordSysIds.length > 0) {
            var listOfDupesToFilterOut = this.getListOfDupeRecordSysIdsReferencedByClassName(tableName, fieldName, listOfClassNames, additionalFilter);
            if(listOfDupesToFilterOut.length > 0) {
                var arrayUtil = new ArrayUtil();
                listOfDupeRecordSysIdsNotReferencedByClass = arrayUtil.diff(listOfDupeRecordSysIds, listOfDupesToFilterOut);
            } else {
                //No records to run a diff on so just give us the original list
                listOfDupeRecordSysIdsNotReferencedByClass = listOfDupeRecordSysIds;
            }
		}
        return listOfDupeRecordSysIdsNotReferencedByClass;
    },

    //Private helper methods to get and set the parsms needed by the public methods.
    //This supports params being passed in via direct method call or ajax
    //Gets the table name to search for dupes on
    _getTableName: function(tableName) {
        this.tableName = this.getParameter('sysparm_tableName');
		if (this.tableName == false || this.tableName == undefined) {
			this.tableName = tableName;
		}
	    return this.tableName;
    },
    
    //Gets the field name to look for dupe values on
    _getFieldName: function(fieldName) {
        this.fieldName = this.getParameter('sysparm_fieldName');
		if (this.fieldName == false || this.fieldName == undefined) {
			this.fieldName = fieldName;
		}
	    return this.fieldName;
    },

    //Gets the list of class names passed in and converts it to any array
    _getLisOfClassNames: function(listOfClassNames) {
        this.listOfClassNames = this.getParameter('sysparm_listOfClassNames');
		if (this.listOfClassNames == false || this.listOfClassNames == undefined) {
			this.listOfClassNames = listOfClassNames;
        }
 
        this.listOfClassNames = this.listOfClassNames.split(',');
        return this.listOfClassNames;
    },

    //Gets any additional filter/encoded query string we want to do on the results
    _getAdditionalFilter:  function(additionalFilter) {
        this.additionalFilter = this.getParameter('sysparam_additionalFilter');
        if (this.additionalFilter == false || this.additionalFilter == undefined) {
			this.additionalFilter = additionalFilter;
		}
	    return this.additionalFilter;
    },

    //Get a list of every column name in the system that references the passed in table name
    _getListColumnNamesReferencedByTable: function(tableName) {
        var listOfColumnNames = [];
        var arrayUtil = new ArrayUtil(); 
        var grSysDataBaseObject = new GlideRecord('sys_dictionary');
        grSysDataBaseObject.addQuery('reference', tableName); 
        grSysDataBaseObject.query();

        while(grSysDataBaseObject.next()) {
            listOfColumnNames.push(grSysDataBaseObject.getValue('element'));
        }
        //Use OOTB Script Include to remove dupe values from this array
        listOfColumnNames = arrayUtil.unique(listOfColumnNames);
        return listOfColumnNames;
    },

    //Checks to see if the table passed in has the column or not
    //Had to make this custom method to check because isValidField would not work
    _doesTableHaveConfigurationItemColumn:  function(tableName, columnName) {
        var grRecord = new GlideRecord(tableName);
        grRecord.setLimit(1);
        grRecord.query();

        if(grRecord.next()){
            var glideRecordUtil = new GlideRecordUtil();
            var arrayUtil = new ArrayUtil();
            var fieldList = glideRecordUtil.getFields(grRecord);
            var result = arrayUtil.indexOf(fieldList, columnName);
           
            if(result > -1) {
                return true;
            }
        }
        return false;
    },

    type: 'DupeFinder'
});
