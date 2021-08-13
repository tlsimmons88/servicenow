answer = (function transformEntry(source) {
	var target = false;
	var transformHelper = new Discovery_Range_Item_Transform(source, target);
	
	//Remove any previous error or warning messages that were put on the current import row from a previous run
	transformHelper.clearImportSetRowCommentField();

	//Checked for required data so getDiscoveryRangeItemSysIdByType() will work right
	if(transformHelper.areRequriedFieldsValid() === false) {
		//This will make a new sys_id be made, but to skip this row we have to do this check again in an onBefore script
		return;
	}
	
	//Find Discovery Range Item Sys ID and set it on the source table to be used by the transfrom map
	return transformHelper.getDiscoveryRangeItemSysIdByType();
})(source);
