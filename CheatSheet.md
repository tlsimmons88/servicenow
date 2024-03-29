__Update read-only form__

```javascript
g_form.setValue('nameOfField', 'valueYouWant');
```

__Log an object example__

```javascript
gs.log('methodName() - ' + JSUtil.describeObject(variableName, 'someString'), 'SourceString');
```

__Stop Discovery from changing the IP by class__

	Add class name to this system property
		Glide.discovery.exclude_ip_sync_classes
			Script that uses this system property
			/nav_to.do?uri=sys_script_include.do?sys_id=350895ad4a36231d00eb160120869c2e
			
__OOB way to make relationships in sensor__

```javascript
g_disco_functions.createRelationshipIfNotExists(parentCI, ci, 'Runs on::Runs');
```

__To load in data in a sensor where the server ci is a reference field on the table.  Example:  Network Adapters__

```javascript
addToRelatedList()
```
__Call Script in query builder__

	Set query to:
		Sys Id is one of 
			javascript: new NameOfScriptInclude().NameOfMethod();
			
__Don't update system fields (sys_updated_on)__

```javascript
gr.autoSysFields(false);
```
__Check Length of Objects in an Object__

```javascript
if(Object.getOwnPropertyNames(myObject).length > 0) { }
```

__Easy way to make List of Objects in Object__

```javascript
if(!myObject.hasOwnProperty(sysIDVar)) {
	myObject[sysIDVar] = {}
}
```

__How to Control which fields are copied from Asset to CI__

alm_asset_ci_field_mapping

__How to Log in Discovery Pattern Eval__

```javascript
ms.log("text"); 
```

__How to log a stacktrace in Service now__

```javascript
gs.log('***** DEBUG - ' + new Date().getTime() + ' - ' + current.sys_id + ' - \n' + GlideLog.getStackTrace(new Packages.java.lang.Throwable()), 'Stacktrace Debug');
```


__How to check if a string is in a string__
```javascript
myString.indexOf('searchterm) > -1
```


__How to export excel with sys_id included__
```javascript
?EXCEL&sysparm_default_export_fields=all
```


__How to query all children class/table in the UI__
```javascript
Table is one of javascript:getTableExtensions('cmdb')
```


__How to get full table list of cmdb_ci classes__
```javascript
Go to: Table:  sys_db_object.
Run:  Query:  nameSTARTSWITHcmdb_ci^ORsuper_class.nameSTARTSWITHcmdb_ci
OR
In Script:  gs.info(new global.TableUtils('cmdb_ci').getAllExtensions());
```

__How to sort number of records by the group by__
```javascript
append one of the two parameters to the URL:
&sysparm_group_sort=COUNT
&sysparm_group_sort=COUNTDESC
```

