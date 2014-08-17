/*
*js继承的实现
*
**/

;(function( global, factory ){
	if ( typeof define === 'function' && define.amd ) {
		define(factory);
	} else if( typeof module === 'object' ){ //node.js
		module.exports = factory();
	} else{
		global.class = factory();
	}
})( this, function(){
	'use strict';

	//单例模式
	var Klass = {

		//创建一个对象
		create : function ( param ) {
			if ( typeof param === 'function' ) {
				return new param();
			} else if ( typeof param === 'object' && param !== null ){
				var obj = {};
				return objExtend( obj, param );
			}
		},

		//继承的实现
		extend : function ( child, parent ) {
			var args = arguments,
				argsLen = args.length;
		}
	};

	/*
	*两个对象的拷贝
	*@param: child : 子对象
	*@param: parent ：父对象
	*@param: override ：是否重写子对象已有的属性，默认是false
	**/
	function objExtend ( child, parent, override ){
		if ( typeof child !== 'object' || typeof parent !== 'object' ) return;

		if ( !!override ) {
			for( i in parent){
				child[i] = parent[i];
			}
		}else {
			for( i in parent ){
				if( child[i] === undefined ){
					child[i] = parent[i];
				}
			}
		}

		return child;
	}


	window.Klass = Klass;
});