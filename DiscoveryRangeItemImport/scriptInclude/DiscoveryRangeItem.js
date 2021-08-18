var Discovery_Range_Item_Transform = Class.create();
Discovery_Range_Item_Transform.prototype = {
    initialize: function(source, target) {
		//Transform Map Objets
		this.source = source;
		this.target = target;
		
		//Required Fields for all imports
		this.discoveryRangeName = false;
		this.networkName = false;
		this.type = false;
		
		//Required Fields when type is IP Address List
		this.ipAddress = false;
		
		//Required Fields when type is IP Address Range
		this.endingIpRange = false;
		this.startingIpRange = false;
		
		//Required Fields when type is IP Network
		this.subnetIp = false;
		this.subnetMask = false;
		
		//ServiceNow Sys Ids
		this.discoveryRangeItemSysId = false;
		
		//Debug flag to log to system log
		this.debug = this._getDebug();
		
		//Set System Log Source
		this.logSource = "Discovery Range Item Import";
    },
	
	//Used in sys_id field source transform script to ensure we have valid data for required fields before we try to find the target sys_id for the import
	areRequriedFieldsValid: function() {
		try {
			this._setupFields();
			
			//Check for blanks
			//The action variable controls which fields are required
			if(this._doRequriedFieldsHaveData() === false) {
				return false;
			}
			
			//Check for valid types
			if(this._isTypeValid() === false) {
				return false;
			}

			//Check for valid Discovery Range parent record to see if it exists
			if(this._isDiscoveryRangeNameValid() === false) {
				return false;
			}
			
			//Passed all validation checks
			return true;
		} catch (ex) {
			var errorMessage = "areRequriedFieldsValid():  Exception:  Failed to validate required fields for Network Name: " + this.source.getValue("u_network_name") + "  "
				+ "\nMessage : " + ex.message
				+ "\nLineNumber : " + ex.lineNumber
				+ "\nSourceName : " + ex.sourceName
				+ "\nName: " + ex.name;
			
			this.log.error(errorMessage);
			this.source.setValue("sys_import_state_comment", errorMessage);
			if(this.debug) {
				//gs.log is the only one that allows the source to be set, that is why we are using it instad of gs.warn or gs.error
				gs.log(errorMessage, this.logSource);
			}
			
			return false;
		}
	},
	
	//First thing to run every import
	//Used in sys_id field source transform script
	//Clear out the comments field on the current import set record that we are attempt to import to remove any any previosu error messages from previous imports
	clearImportSetRowCommentField:  function() {
		this.source.setValue("sys_import_state_comment", "NULL");
		this.source.update();
	},

	//Used in the onAfter Transfrom Map Script to try and create a ip address record or update it
	createOrUpdateIpAddress:  function() {
		try {
			this._setupFields();

			//Check for blanks
			//The action variable controls which fields are required
			if(this._doRequriedFieldsHaveData() === false) {
				return false;
			}

			if(this.type === "ip address list") {
				this.discoveryRangeItemSysId = this.target.getValue("sys_id");
				var grIpAddress = new GlideRecord("discovery_range_item_ip");
				grIpAddress.addQuery("item_parent", this.discoveryRangeItemSysId);
				grIpAddress.addQuery("ip_address", this.ipAddress);
				grIpAddress.query();

				if(grIpAddress.next()) {
					//already exsist so force the system to make an update
					grIpAddress.setForceUpdate(true);
					grIpAddress.setValue("ip_address", this.ipAddress);
					grIpAddress.update();
				} else {
					//create new record
					grIpAddress.initialize();
					grIpAddress.setValue("ip_address", this.ipAddress);
					grIpAddress.setValue("item_parent", this.discoveryRangeItemSysId);
					grIpAddress.insert();
				}
			}
			return true;
		} catch (ex) {
			var errorMessage = "createOrUpdateIpAddress():  Exception:  Failed to create or update ip address record on the discovery_range_item_ip table for Network Name: " + this.source.getValue("u_network_name") + "  "
				+ "\nMessage : " + ex.message
				+ "\nLineNumber : " + ex.lineNumber
				+ "\nSourceName : " + ex.sourceName
				+ "\nName: " + ex.name;
			
			this.log.error(errorMessage);
			this.source.setValue("sys_import_state_comment", errorMessage);
			if(this.debug) {
				//gs.log is the only one that allows the source to be set, that is why we are using it instad of gs.warn or gs.error
				gs.log(errorMessage, this.logSource);
			}
			
			return false;
		}
	},

	//Helper method to just check for blank values on the required fields
	_doRequriedFieldsHaveData:  function() {
		var errorMessage = "";

		//Required for all imports
		if(gs.nil(this.discoveryRangeName)) {
			errorMessage = "Error:  Discovery Range Name value is blank.  Network Name = " + this.networkName;
			this.source.setValue("sys_import_state_comment", errorMessage);
			this.log.error(errorMessage);
			if(this.debug) {
				//gs.log is the only one that allows the source to be set, that is why we are using it instad of gs.warn or gs.error
				gs.log(errorMessage, this.logSource);
			}
			
			return false;
		}

		if(gs.nil(this.networkName)) {
			errorMessage = "Error:  Network Name value is blank.  Discovery Range Name = " + this.discoveryRangeName;
			this.source.setValue("sys_import_state_comment", errorMessage);
			this.log.error(errorMessage);
			if(this.debug) {
				//gs.log is the only one that allows the source to be set, that is why we are using it instad of gs.warn or gs.error
				gs.log(errorMessage, this.logSource);
			}
			
			return false;
		}

		if(gs.nil(this.type)) {
			errorMessage = "Error:  Type value is blank.  Network Name = " + this.networkName;
			this.source.setValue("sys_import_state_comment", errorMessage);
			this.log.error(errorMessage);
			if(this.debug) {
				//gs.log is the only one that allows the source to be set, that is why we are using it instad of gs.warn or gs.error
				gs.log(errorMessage, this.logSource);
			}
			
			return false;
		}

		//The rest of the checks are based on type
		if(this.type === "ip address list") {

			if(gs.nil(this.ipAddress)) {
				errorMessage = "Error:  IP Address value is blank.  Network Name = " + this.networkName;
				this.source.setValue("sys_import_state_comment", errorMessage);
				this.log.error(errorMessage);
				if(this.debug) {
					//gs.log is the only one that allows the source to be set, that is why we are using it instad of gs.warn or gs.error
					gs.log(errorMessage, this.logSource);
				}
				
				return false;
			}

		} else if(this.type === "ip address range") {

			if(gs.nil(this.endingIpRange)) {
				errorMessage = "Error:  Ending IP Range value is blank.  Network Name = " + this.networkName;
				this.source.setValue("sys_import_state_comment", errorMessage);
				this.log.error(errorMessage);
				if(this.debug) {
					//gs.log is the only one that allows the source to be set, that is why we are using it instad of gs.warn or gs.error
					gs.log(errorMessage, this.logSource);
				}
				
				return false;
			}

			if(gs.nil(this.startingIpRange)) {
				errorMessage = "Error:  Starting IP Range value is blank.  Network Name = " + this.networkName;
				this.source.setValue("sys_import_state_comment", errorMessage);
				this.log.error(errorMessage);
				if(this.debug) {
					//gs.log is the only one that allows the source to be set, that is why we are using it instad of gs.warn or gs.error
					gs.log(errorMessage, this.logSource);
				}
				
				return false;
			}

		} else if(this.type === "ip network") {

			if(gs.nil(this.subnetIp)) {
				errorMessage = "Error:  Subnet IP value is blank.  Network Name = " + this.networkName;
				this.source.setValue("sys_import_state_comment", errorMessage);
				this.log.error(errorMessage);
				if(this.debug) {
					//gs.log is the only one that allows the source to be set, that is why we are using it instad of gs.warn or gs.error
					gs.log(errorMessage, this.logSource);
				}
				
				return false;
			}

			if(gs.nil(this.subnetMask)) {
				errorMessage = "Error:  Subnet Mask value is blank.  Network Name = " + this.networkName;
				this.source.setValue("sys_import_state_comment", errorMessage);
				this.log.error(errorMessage);
				if(this.debug) {
					//gs.log is the only one that allows the source to be set, that is why we are using it instad of gs.warn or gs.error
					gs.log(errorMessage, this.logSource);
				}
				
				return false;
			}
		}
		return true;
	},
	
	//Used in sys_id field source transform script to try and find an exsisting discovery range item record based on the fields need for each supported type
	//We are using this to make our fields we want to coalesce on dynamic based on the type value sent in
	//If we do not find an exsisting record the transform map will auto make a new record for us
	//The transform map coalesce's on the sys_id 
	getDiscoveryRangeItemSysIdByType: function() {
		try {
			switch(this.type)
			{
				case "ip address list": {
					this.discoveryRangeItemSysId = this._getIpAddressListSysId();
					break;
				}
				case "ip address range": {
					this.discoveryRangeItemSysId = this._getIpAddressRangeSysId();
					break;
				}
				case "ip network": {
					this.discoveryRangeItemSysId = this._getIpNetworkSysId();
					break;
				}
				default: {
					break;
				}
			}
			
			return this.discoveryRangeItemSysId;
		} catch(ex) {
			gs.error("getDiscoveryRangeItemSysIdByType():  Exception:  Failed to get Discovery Range Item Sys ID by Type for Discovery Range Item Import for Network Name: " + this.source.getValue("u_network_name") + ".  "
					 + "\nMessage : " + ex.message
					 + "\nLineNumber : " + ex.lineNumber
					 + "\nSourceName : " + ex.sourceName
					 + "\nName: " + ex.name, this.logSource);
			return false;
		}
	},
	
	_getIpAddressListSysId: function() {
		try  {
			var grDiscoveryRangeItem = new GlideRecord("discovery_range_item");
			grDiscoveryRangeItem.addQuery("type", "IP Address List");
			grDiscoveryRangeItem.addQuery("active", true);
			grDiscoveryRangeItem.addQuery("parent.name", this.discoveryRangeName);
			grDiscoveryRangeItem.addQuery("name", this.networkName);
			grDiscoveryRangeItem.query();

			if(grDiscoveryRangeItem.next()) {
				this.discoveryRangeItemSysId = grDiscoveryRangeItem.getValue("sys_id");
			}
			return this.discoveryRangeItemSysId;

		} catch(ex) {
			gs.error("getIpAddressListSysId():  Exception:  Failed to get Sys ID by Type of IP Address List for Network Name: " + this.source.getValue("u_network_name") + ".  "
					 + "\nMessage : " + ex.message
					 + "\nLineNumber : " + ex.lineNumber
					 + "\nSourceName : " + ex.sourceName
					 + "\nName: " + ex.name, this.logSource);
			return false;
		}
	},

	_getIpAddressRangeSysId: function() {
		try {
			var grDiscoveryRangeItem = new GlideRecord("discovery_range_item");
			grDiscoveryRangeItem.addQuery("type", "IP Address Range");
			grDiscoveryRangeItem.addQuery("active", true);
			grDiscoveryRangeItem.addQuery("parent.name", this.discoveryRangeName);
			grDiscoveryRangeItem.addQuery("name", this.networkName);
			grDiscoveryRangeItem.addQuery("start_ip_address", this.startingIpRange);
			grDiscoveryRangeItem.addQuery("end_ip_address", this.endingIpRange);
			grDiscoveryRangeItem.query();

			if(grDiscoveryRangeItem.next()) {
				this.discoveryRangeItemSysId = grDiscoveryRangeItem.getValue("sys_id");
			}
			return this.discoveryRangeItemSysId;

		} catch(ex) {
			gs.error("getIpAddressRangeSysId():  Exception:  Failed to get Sys ID by Type of IP Address Range for Network Name: " + this.source.getValue("u_network_name") + ".  "
					 + "\nMessage : " + ex.message
					 + "\nLineNumber : " + ex.lineNumber
					 + "\nSourceName : " + ex.sourceName
					 + "\nName: " + ex.name, this.logSource);
			return false;
		}
	},

	_getIpNetworkSysId: function() {
		try {
			var grDiscoveryRangeItem = new GlideRecord("discovery_range_item");
			grDiscoveryRangeItem.addQuery("type", "IP Network");
			grDiscoveryRangeItem.addQuery("active", true);
			grDiscoveryRangeItem.addQuery("parent.name", this.discoveryRangeName);
			grDiscoveryRangeItem.addQuery("name", this.networkName);
			grDiscoveryRangeItem.addQuery("network_ip", this.subnetIp);
			grDiscoveryRangeItem.addQuery("netmask", this.subnetMask);
			grDiscoveryRangeItem.query();

			if(grDiscoveryRangeItem.next()) {
				this.discoveryRangeItemSysId = grDiscoveryRangeItem.getValue("sys_id");
			}
			return this.discoveryRangeItemSysId;

		} catch(ex) {
			gs.error("getIpNetworkSysId():  Exception:  Failed to get Sys ID by Type of IP Network for Network Name: " + this.source.getValue("u_network_name") + ".  "
					 + "\nMessage : " + ex.message
					 + "\nLineNumber : " + ex.lineNumber
					 + "\nSourceName : " + ex.sourceName
					 + "\nName: " + ex.name, this.logSource);
			return false;
		}
	},
	
	//Helper method to make sure the Discovery Range name passed in matches an existing record
	_isDiscoveryRangeNameValid: function() {
		try {
			var grDiscoveryRange = new GlideRecord("discovery_range");
			grDiscoveryRange.addQuery("active", true);
			grDiscoveryRange.addQuery("name", this.discoveryRangeName);
			grDiscoveryRange.query();

			if(grDiscoveryRange.next()) {
				return true;
			}

			var errorMessage = "";
			errorMessage = "Error:  Could not find an active Discovery Range record on the table discovery_range with Discovery Range Name = " + this.discoveryRangeName + ".  Network Name = " + this.networkName;
			this.source.setValue("sys_import_state_comment", errorMessage);
			this.log.error(errorMessage);
			if(this.debug) {
				//gs.log is the only one that allows the source to be set, that is why we are using it instad of gs.warn or gs.error
				gs.log(errorMessage, this.logSource);
			}

			return false;
		} catch (ex) {
			var errorMessage = "_isDiscoveryRangeNameValid():  Exception:  Failed to validate Discovery Range Name:  " + this.discoveryRangeName + " from the soruce table for Network Name: " + this.networkName + ".  "
				+ "\nMessage : " + ex.message
				+ "\nLineNumber : " + ex.lineNumber
				+ "\nSourceName : " + ex.sourceName
				+ "\nName: " + ex.name;
			
			this.log.error(errorMessage);
			this.source.setValue("sys_import_state_comment", errorMessage);
			if(this.debug) {
				//gs.log is the only one that allows the source to be set, that is why we are using it instad of gs.warn or gs.error
				gs.log(errorMessage, this.logSource);
			}
			
			return false;
		}
	},

	//Helper method to make sure the type passed in is a valid type
	_isTypeValid: function() {
		var errorMessage = "";

		//Required for all imports
		if(this.type != "ip address list" &&
		   this.type != "ip address range" &&
		   this.type != "ip network") {
			errorMessage = "Error:  Type value is not valid.  Type = " + this.type + " Network Name = " + this.networkName;
			this.source.setValue("sys_import_state_comment", errorMessage);
			this.log.error(errorMessage);
			if(this.debug) {
				//gs.log is the only one that allows the source to be set, that is why we are using it instad of gs.warn or gs.error
				gs.log(errorMessage, this.logSource);
			}
			
			return false;
		}
		return true;
	},
	
	//Helper method to get debug flag value from system property
	_getDebug:  function() {
		var doDebug = gs.getProperty("Discovery.Range.Item.Import.Transform.Debug", false);
		if(doDebug === "true") {
			doDebug = true;
		} else {
			doDebug = false;
		}
		return doDebug;
	},
	
	//Helper method to take values from source table and try and clean them up before we try and use them in the import process
	_setupFields: function() {
		try {
			//Required Fields for all imports
			this.discoveryRangeName = this.source.getValue("u_discovery_range_name") ? this.source.getValue("u_discovery_range_name").trim() : "";
			this.networkName = this.source.getValue("u_network_name") ? this.source.getValue("u_network_name").trim(): "";
			this.type = this.source.getValue("u_type") ? this.source.getValue("u_type").toLowerCase().trim(): "";
			
			//Required Fields when type is IP Address List
			this.ipAddress = this.source.getValue("u_ip_address") ? this.source.getValue("u_ip_address").trim() : "";
			
			//Required Fields when type is IP Address Range
			this.endingIpRange = this.source.getValue("u_ending_ip_range") ? this.source.getValue("u_ending_ip_range").trim() : "";
			this.startingIpRange = this.source.getValue("u_starting_ip_range") ? this.source.getValue("u_starting_ip_range").trim() : "";
			
			//Required Fields when type is IP Network (or sometimes called subnet)
			this.subnetIp = this.source.getValue("u_subnet_ip") ? this.source.getValue("u_subnet_ip").trim() : "";
			this.subnetMask = this.source.getValue("u_subnet_mask") ? this.source.getValue("u_subnet_mask").trim() : "";
			
		} catch (ex) {
			var errorMessage = "_setupFields():  Exception:  Failed to get required data from the soruce table for Network Name: " + this.source.getValue("u_network_name") + ".  "
				+ "\nMessage : " + ex.message
				+ "\nLineNumber : " + ex.lineNumber
				+ "\nSourceName : " + ex.sourceName
				+ "\nName: " + ex.name;
			
			this.log.error(errorMessage);
			this.source.setValue("sys_import_state_comment", errorMessage);
			if(this.debug) {
				//gs.log is the only one that allows the source to be set, that is why we are using it instad of gs.warn or gs.error
				gs.log(errorMessage, this.logSource);
			}
			
			return false;
		}
	},

    type: 'Discovery_Range_Item_Transform'
};
