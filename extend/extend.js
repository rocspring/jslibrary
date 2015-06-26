(function () {
	var isInit = false;

	this.Class = function() {};

	Class.extend = function() {


		var newPrototype = new this();


		function Base() {

		}

		Base.prototype = newPrototype;

		Base.prototype.constructor = Base;

		Base.extend = arguments.callee;


		return Base;
	};

})();