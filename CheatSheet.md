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
