/****Configuration Settings****/
//Change this to grab the records that need to be updated
var listOfAssetTags = "";
var query = "asset_tagIN" + listOfAssetTags;

//Create object of columns and the values to set those columns to
//Add or remove properties to "associativeArray" to change what columns will be updated and to what value.  NOTE:  property name must match column name in table to work
//NOTE:  reference fields must use the sys_id for the value to get set
var associativeArray  = {};
associativeArray.model_category = "";

var dryRun = true;  //true will only log the change, false will actually do the update
var limit = 0;	    //setting this to 0 will do all records
/****Configuration Settings****/


gs.log("Starting Fix Script to update Asset Record", "Asset Update");

updateAsset(query, associativeArray, limit, dryRun);

gs.log("Finishing Fix Script to update Asset Record", "Asset Update");



function updateAsset(query, associativeArray, limit, dryRun) {
    try {
        var grAsset = new GlideRecord("alm_asset");
        grAsset.addEncodedQuery(query);
        if (limit > 0) {
            grAsset.setLimit(limit);
        }
        grAsset.query();

        while(grAsset.next()) {
            for(var key in associativeArray) {
                if(associativeArray.hasOwnProperty(key)) {
                    grAsset.setValue(key, associativeArray[key]);
                }
            }

            gs.log("updateAsset():  Updating Asset Record:  " + grAsset.getValue('asset_tag') + " to:  " +  JSUtil.describeObject(associativeArray, "grAsset"), "Asset Update");
            
            if(dryRun === false) {
                grAsset.update();
            }
        }
    } catch (ex) {
        gs.error("updateAsset():  Exception:  Failed to update the Asset Record  "
            + "\nMessage : " + ex.message
            + "\nLineNumber : " + ex.lineNumber
            + "\nSourceName : " + ex.sourceName
            + "\nName: " + ex.name, "Asset Update");
    }
}
