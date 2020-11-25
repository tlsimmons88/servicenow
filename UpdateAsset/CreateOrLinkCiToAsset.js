/****Configuration Settings****/
//Change this to grab the records that need to be updated
var listOfAssetTags = "";
var query = "ciISEMPTY^asset_tagIN" + listOfAssetTags;

var dryRun = true;  //true will only log the change, false will actually do the update
var limit = 0;	    //setting this to 0 will do all records
/****Configuration Settings****/


gs.log("Starting Fix Script to Create or Link Ci to Asset", "Asset Update");

createOrLinkCiToAsset(query, limit, dryRun);

gs.log("Finishing Fix Script to Create or Link Ci to Asset", "Asset Update");


//This fuction will find any asst matching the query and try to either create a new CI to link to it or link an exsisting ci 
function createOrLinkCiToAsset(query, limit, dryRun) {
    try {
        var grAsset = new GlideRecord("alm_asset");
        grAsset.addEncodedQuery(query);
        if (limit > 0) {
            grAsset.setLimit(limit);
        }
        grAsset.query();

        while(grAsset.next()) {

            //NOTE:  Not ideal to do a nested query like tis but this fix script shouldn't be ran often or with huge numbers to casue a performance impact
            var currentAssetTag = grAsset.getValue("asset_tag");
            var grCi = getCiByAssetTag(currentAssetTag);
            if(grCi === false) {
                gs.log("createOrLinkCiToAsset():  Creating CI Record for Asset:  " + grAsset.getValue('asset_tag'), "Asset Update");
                
                if(dryRun === false) {
					(new AssetandCI()).createCI(grAsset);
					grAsset.update();
                }
            } else {
                gs.log("createOrLinkCiToAsset():  Linking CI Record for Asset:  " + grAsset.getValue('asset_tag'), "Asset Update");

                if(dryRun === false) {
                    grAsset.setValue("ci", grCi.getValue("sys_id"));
                    grAsset.update();
                    
                    grCi.setValue("asset", grAsset.getValue("sys_id"));
                    grCi.update();
                }
            }
        }
    } catch (ex) {
        gs.addErrorMessage(ex);
        gs.error("createOrLinkCiToAsset():  Exception:  Failed to Create or Link CI Record  "
            + "\nMessage : " + ex.message
            + "\nLineNumber : " + ex.lineNumber
            + "\nSourceName : " + ex.sourceName
            + "\nName: " + ex.name, "Asset Update");
        return false;
    }
}

//Function to find a CI record by asset tag.
//If found then return the entire gliderecord
//If NOT found then return false
function getCiByAssetTag(assetTag) {
    try {
        var ciQuery = "install_status!=7^asset_tag=" + assetTag;
        var grCi = new GlideRecord("cmdb_ci");
        grCi.addEncodedQuery(ciQuery);
        grCi.query();

        if(grCi.next()) {
            return grCi;
        } else {
            return false;
        }
    } catch (ex) {
        gs.addErrorMessage(ex);
        gs.error("getCiByAssetTag():  Exception:  Failed to find CI Record by Asset Tag  " + assetTag + ".  "
            + "\nMessage : " + ex.message
            + "\nLineNumber : " + ex.lineNumber
            + "\nSourceName : " + ex.sourceName
            + "\nName: " + ex.name, "Asset Update");
        return false;
    }
}
