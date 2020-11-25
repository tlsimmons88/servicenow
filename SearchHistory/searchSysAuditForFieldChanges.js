function searchSysAuditForFieldChanges (table, encodedQuery, limit, lastLimit, fields, users) {
    var grAudit, query, changes, hasChange;
    var instanceURL = gs.getProperty('glide.servlet.uri');
    var output = '';
    var gr = new GlideRecord(table);
    gr.addEncodedQuery(encodedQuery);
    gr.setLimit(limit);
    gr.query();
    gs.debug("Number of Records found in query:  " + gr.getRowCount());
    var counter = 0;
	
    while (gr.next()) {
        hasChange = false;
        changes = [];
        grAudit = new GlideRecord('sys_audit');
        query = 'documentkey=' + gr.sys_id.getValue() + '^fieldname=' + fields.join('^ORfieldname=');
      
	    if (users) {
          query += '^sys_created_by=' + users.join('^ORsys_created_by=');
        }
	  
        grAudit.addEncodedQuery(query);
        grAudit.orderByDesc('sys_created_on');
        grAudit.setLimit(lastLimit);
        grAudit.query();
	  
        var count = grAudit.getRowCount();
      
	    if (count >= 1) {
            while (grAudit.next()) {
                if (grAudit.oldvalue.getValue() !== grAudit.newvalue.getValue()) {
                    hasChange = true;
                    changes.push({ fieldname: grAudit.fieldname.getValue(), oldV: grAudit.oldvalue.getValue(), newV: grAudit.newvalue.getValue(), when: grAudit.sys_created_on.getValue(), user: grAudit.user.getValue() });
                }
            }
			
            if (hasChange) {
                output += '\n\n'+ gr.getDisplayValue() + ' \n' + JSON.stringify(changes);
		        //output += '\n\n<a target="_blank" href=' + instanceURL + 'nav_to.do?uri=' + table + '.do?sys_id=' + gr.sys_id.getValue() + '">' + gr.getDisplayValue() + '</a> \nsys_id=' + gr.sys_id.getValue() + ' \n' + JSON.stringify(changes);

               counter++;
            }
        }
    }
	
    gs.debug("Number of Records found with changes:  " + counter);
    gs.debug(output);
}
​
var table = "";
var encodedQuery = "";
var fields = ['someField1', 'someField2']; // can search for multiple fields, hence array
var users = []; // if empty, any user, else list like ['user1', 'user2']
var limit = 500000; // has to be something, 500000 is OK
var lastLimit = 100; // how deep into the history should we search?
searchSysAuditForFieldChanges(table, encodedQuery, limit, lastLimit, fields, users);
