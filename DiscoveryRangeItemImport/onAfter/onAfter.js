/*  CHANGE LOG
*   
  Travis Simmons:  This onAfter Script runs to:
  1.  Create up update an ip address record if type is "IP Address List"
*/

(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
	var transformHelper = new Discovery_Range_Item_Transform(source, target);
	transformHelper.createOrUpdateIpAddress();
})(source, map, log, target);
