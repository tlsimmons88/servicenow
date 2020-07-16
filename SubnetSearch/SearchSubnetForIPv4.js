//List of IPs to check
var strListOfIps = "";
//Query to get list of netowrks to search
var networkQuery = "";
var ips = strListOfIps.split(",");
var networks = getNetworks(networkQuery);
var i = 0;
var j = 0;
var isIpInNetowrk = false

//Loop over each ip
for(i = 0; i < ips.length; i++) {
	//Loops over each ip netowrk
	for(j = 0; j < networks.length; j++) {
		isIpInNetowrk = isIpV4InNetwork(ips[i], networks[j])
		if(isIpInNetowrk == true) {
			gs.log("isIpV4InNetwork(): IP FOUND:  isIpInNetowrk = " + isIpInNetowrk + " with ip = " + ips[i] + " and network = " + networks[j], "Discovery Utils")
			break;
		}
	}
	//gs.log("isIpV4InNetwork():  IP NOT FOUND:  isIpInNetowrk = " + isIpInNetowrk + " with ip = " + ips[i] + " network = ALL" , "Discovery Utils")
}

/*
*  Function to seach a given ip netowrk range/subnet for a the given ip
*  Returns:  true/false
*/
function isIpV4InNetwork(ip, networkSummary) {
	 var ipAsInt = new SncIPAddressV4(ip).getAddressAsLong();
	 var ipNetwork = new SncIPNetworkV4(networkSummary);
	 var startingIpAsInt = ipNetwork.getAddress().getAddressAsLong();
	 var endingIpAsInt = ipNetwork.getBroadcastAddress().getAddressAsLong();

	 if (startingIpAsInt < ipAsInt && ipAsInt < endingIpAsInt){
		return true;
	 } else {
		return false;
	 }
}

/*
*  Function to return any IP Netorks Ranges/Subnets that match the given query
*  Returns:  Array of subnets in CIDR notation
*/
function getNetworks(query) {
	var networks = [];
	if(query.length > 0) {
		var grDiscoveryRangeItem = new GlideRecord("discovery_range_item");
		grDiscoveryRangeItem.addEncodedQuery(query);
		grDiscoveryRangeItem.addQuery("type", "IP Network");
		grDiscoveryRangeItem.query();
		while(grDiscoveryRangeItem.next()) {
			networks.push(grDiscoveryRangeItem.getValue("summary"))
		}
	}
	return networks;
}
