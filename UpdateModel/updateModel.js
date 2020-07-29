var arr = [];
var dryRun = true;  //true will only log the change, false will actually do the update
var limit = 0;	    //setting this to 0 will do all records

var obj = {old_sysId: "someSysID_changeMe", new_sysId: "someSysID_changeMe"};
arr.push(obj);

gs.log("Fix Script:  Update Model on CI, Asset or Consumable:  Starting", "Update Model");
gs.log("Fix Script:  arr.length:  " + arr.length);

for (var i = 0; i < arr.length; i++) {
	//updateAssetModel(arr[i].old_sysId, arr[i].new_sysId, limit, dryRun);
	//updateCiModel(arr[i].old_sysId, arr[i].new_sysId, limit, dryRun);
	//updateConsumableModel(arr[i].old_sysId, arr[i].new_sysId, limit, dryRun);
}
gs.log("Fix Script:  Update Model on CI, Asset or Consumable:  Done", "Update Model");

function updateAssetModel(oldSysId, newSysId, limit, dryRun) {
    try {
        var grAsset = new GlideRecord('alm_hardware');
        grAsset.addQuery('model.sys_id', oldSysId);
        if (limit > 0) {
            grAsset.setLimit(limit);
        }
        grAsset.query();
        
        while(grAsset.next()) {
            grAsset.setValue('model', newSysId);

            gs.log("Fix Script:  updateAssetModel():  Changing asset: " + grAsset.getDisplayValue() + " model from:  " + oldSysId + " to:  " + newSysId, "Update Model");

            if(dryRun === false) {
                grAsset.update();
            }
        }
    } catch (ex) {
        gs.error("updateAssetModel():  Exception:  Failed to update the Model on the Asset Record  "
            + "\nMessage : " + ex.message
            + "\nLineNumber : " + ex.lineNumber
            + "\nSourceName : " + ex.sourceName
            + "\nName: " + ex.name, "Update Model");
    }

}
function updateCiModel(oldSysId, newSysId, limit, dryRun) {
    try {
        var grCi = new GlideRecord('cmdb_ci');
        grCi.addQuery('model_id.sys_id', oldSysId);
        if (limit > 0) {
            grCi.setLimit(limit);
        }
        grCi.query();
        
        while(grCi.next()) {
            grCi.setValue('model', newSysId);

            gs.log("Fix Script:  updateCiModel():  Changing ci: " + grCi.getDisplayValue() + " model from:  " + oldSysId + " to:  " + newSysId, "Update Model");

            if(dryRun === false) {
                grCi.update();
            }
        }
    } catch (ex) {
        gs.error("updateCiModel():  Exception:  Failed to update the Model on the CI Record  "
            + "\nMessage : " + ex.message
            + "\nLineNumber : " + ex.lineNumber
            + "\nSourceName : " + ex.sourceName
            + "\nName: " + ex.name, "Update Model");
    }
}

function updateConsumableModel(oldSysId, newSysId, limit, dryRun) {
    try {
        var grConsumable = new GlideRecord('alm_consumable');
        grConsumable.addQuery('model.sys_id', oldSysId);
        if (limit > 0) {
            grConsumable.setLimit(limit);
        }
        grConsumable.query();
        
        while(grConsumable.next()) {
            grConsumable.setValue('model', newSysId);

            gs.log("Fix Script:  updateConsumableModel():  Changing Consumable: " + grConsumable.getDisplayValue() + " model from:  " + oldSysId + " to:  " + newSysId, "Update Model");

            if(dryRun === false) {
                grConsumable.update();
            }
        }
    } catch (ex) {
        gs.error("updateConsumableModel():  Exception:  Failed to update the Model on the Consumable Record  "
            + "\nMessage : " + ex.message
            + "\nLineNumber : " + ex.lineNumber
            + "\nSourceName : " + ex.sourceName
            + "\nName: " + ex.name, "Update Model");
    }
}
