/*  CHANGE LOG
*   
  Travis Simmons:  This onBefore Script runs to:
  1.  Run validation checks on data the data being imported and skip the row if we do not have all the data we need.
*/

(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
	var transformHelper = new Discovery_Range_Item_Transform(source, target);

	//Checked for required data after we try and match on sys_id in the fieild script.  
	//You cannot skip a row from a source field script so we have to make a second call here to catch it
	if(transformHelper.areRequriedFieldsValid() === false) {
		ignore = true;
		//Found that trasfrom would sometimes try and run without return
		return;
	}
})(source, map, log, target);
