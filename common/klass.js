/*
*js继承的实现
*@author: wshp
*@E-mail: wshp000000@gmail.com
*参考 John Resig 的 Simple JavaScript Inheritance
*实现的目标：
*1.Klass是一个基类，所有的类都是从Klass类继承的
*2.任何一个新的类都是从现有的类扩展开的，最初始的类是Klass类
*3.子类可以调用父类的同名方法
*
**/

/*
*	实现后的使用方法
*	1.直接继承自基类Klass
*	var First = Klass({});
*	2.继承自其它的类
*	var Two = First.klass({});
*
**/

;(function () {

	var initializing = true,
		fnTest = /xyz/.test(function () { 'xyz';}) ? /\b_super\b/ : /.*/;//判断浏览器是否支持函数序列化

	function Klass ( ) {}

	Klass.klass = function ( param ){

		var obj = typeof param === 'object' ? param : {},
			_super = this.prototype; //父类的原型对象

		initializing = true;
		//保存父类的实例
		var proto = new this();
		initializing = false;

		//如果传入的方法或属性和父类的方法或属性同名时，覆盖父类的方法或属性
		var i;
		for( i in param ){

			if ( typeof _super[i] === 'function' && typeof param[i] === 'function' && fnTest.test(param[i])) {

				proto[i] = (function(i, func){
					return function() {
						var temp = this._super;

						this._super = _super[i];

						var ret = func.apply( this, arguments );

						this._super = temp;

						return ret;
					};

				})( i, param[i] );

			}else{
				proto[i] = param[i];
			}
		}

		function F (){
			if( !initializing && this.init ){
				this.init();
			}
		}

		F.prototype = proto;
		F.prototype.constructor = F;
		F.klass = arguments.callee;

		return F;
	};
	
	window.Klass = Klass;
})();


