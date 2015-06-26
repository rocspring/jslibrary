(function() {
	var isInit = false,
		funcTest = /xyz/.test(function() {
            xyz;
        }) ? /\b_super\b/ : /.*/;

	this.Class = function() {};

	Class.extend = function(opts) {

		var _super = this.prototype;

		isInit = true;
		var newPrototype = new this();
		isInit = false;

		for (var name in opts) {

			if ( typeof _super[name] === 'function' &&
				typeof opts[name] === 'function' &&
				funcTest.test(opts[name]) ) {
				newPrototype[name] = (function(name, func){

					return function() {
						var temp = this._super;

						this._super = _super[name];

						var reslt = func.apply(this, arguments);

						this._super = temp;

						return reslt;
					};
				})(name, opts[name]);
			} else {
				newPrototype[name] = opts[name];
			}

		}

		function Base() {
			if (!isInit && !!this.init) {
				this.init.apply(this, arguments);
			}
		}

		Base.prototype = newPrototype;

		Base.prototype.constructor = Base;

		Base.extend = arguments.callee;


		return Base;
	};

})();