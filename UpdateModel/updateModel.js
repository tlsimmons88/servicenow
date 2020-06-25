var arr = [];

var obj = {old_sysId: "someSysID_changeMe", new_sysId: "someSysID_changeMe"};
arr.push(obj);

gs.info("Fix Script:  Update Model on CI, Asset or Consumable:  Starting");
gs.info("Fix Script:  arr.length:  " + arr.length);
for (var i = 0; i < arr.length; i++) {
	//updateAssetModel(arr[i].old_sysId, arr[i].new_sysId);
	//updateCiModel(arr[i].old_sysId, arr[i].new_sysId);
	//updateConsumableModel(arr[i].old_sysId, arr[i].new_sysId);
}
gs.info("Fix Script:  Update Model on CI, Asset or Consumable:  Done");

function updateAssetModel(oldSysId, newSysId){
	var grAsset = new GlideRecord('alm_hardware');
	grAsset.addQuery('model.sys_id', oldSysId);
	grAsset.query();
	
	while(grAsset.next()){
		grAsset.setValue('model', newSysId);
		grAsset.update();
		gs.log("Fix Script:  updateAssetModel():  Changing asset: " + grAsset.getDisplayValue() + " model from:  " + oldSysId + " to:  " + newSysId);
	}
}

function updateCiModel(oldSysId, newSysId){
	var grCi = new GlideRecord('cmdb_ci');
	grCi.addQuery('model_id.sys_id', oldSysId);
	grCi.query();
	
	while(grCi.next()){
		grCi.setValue('model', newSysId);
		grCi.update();
		gs.log("Fix Script:  updateCiModel():  Changing ci: " + grCi.getDisplayValue() + " model from:  " + oldSysId + " to:  " + newSysId);
	}
}

function updateConsumableModel(oldSysId, newSysId){
	var grConsumable = new GlideRecord('alm_consumable');
	grConsumable.addQuery('model.sys_id', oldSysId);
	grConsumable.query();
	
	while(grConsumable.next()){
		grConsumable.setValue('model', newSysId);
		grConsumable.update();
		gs.log("Fix Script:  updateConsumableModel():  Changing Consumable: " + grConsumable.getDisplayValue() + " model from:  " + oldSysId + " to:  " + newSysId);
	}
}
