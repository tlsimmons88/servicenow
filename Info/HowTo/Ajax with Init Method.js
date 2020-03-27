//How to use OOTB initialize method in Ajax script include
//Undocumented way to use the built in initialize method found in non-ajax script includes
initialize: function (request, responseXML, gc) {
    global.AbstractAjaxProcessor.prototype.initialize.call(this, request, responseXML, gc);
    this.someVar = false;
},

//Private helper method to get and set the parsms needed by the public methods.
//This supports params being passed in via direct method call or ajax
_someMethod: function(someVarPassedIn) {
    this.someVar = this.getParameter('sysparm_someVarAjax');
        if (this.someVar == false || this.someVar == undefined) {
                this.someVar = someVarPassedIn;
        }
    return this.someVar;
}
