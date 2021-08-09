//Script to make a "dynamic" coalesce during a transform map by using a a script source on a sys_id field
 //Source field = [script], Target field = Sys ID, Coalesce = true

//Example Script
answer = (function transformEntry (source) {
	return find_existing_asset() || find_tagless_asset() || gs.generateGUID();

	function find_existing_asset () {
		var alm_hardware = new GlideRecord('alm_hardware');

		alm_hardware.addQuery('model.display_name', source.u_model);
		alm_hardware.addQuery('asset_tag', source.u_asset_tag);

		alm_hardware._query();

		if (alm_hardware._next()) {
			return alm_hardware.getUniqueValue();
		}
	}

	function find_tagless_asset () {
		var alm_hardware = new GlideRecord('alm_hardware');

		alm_hardware.addQuery('model.display_name', source.u_model);
		alm_hardware.addNullQuery('asset_tag');

		alm_hardware._query();

		if (alm_hardware._next()) {
			return alm_hardware.getUniqueValue();
		}
	}
})(source);
