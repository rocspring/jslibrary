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

	function Klass ( param ) {

		var obj = typeof param === 'object' ? param : {};

		function F (){
			if( !initializing && this.init ){
				this.init();
			}
		}
		F.prototype = obj;
		F.prototype.constructor = F;

		F.klass = function (){

			var obj = typeof param === 'object' ? param : {};

			initializing = true;

			var super = new this();

			initializing = false;

			function F (){
				if( !initializing && this.init ){
					this.init();
				}
			}

			F.prototype = new this();
			F.prototype.constructor = F;
			F._super = super;
			extend( F.prototype, obj );

			F.klass = this.klass;

			return F;
		};

		return F;

	}
	
	function extend ( c, p ){
		if ( typeof c === 'object' && typeof p === 'object' ) {
			var i;
			for( i in p ){
				if( p.hasOwenPrototype(i) ){
					c[i] = p[i];
				}
			}
		}
	}

	window.Klass = Klass;
})();


