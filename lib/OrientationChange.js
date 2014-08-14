/*
*移动端横竖屏转换事件的监听
*@author: wshp
*@E-mail: wshp000000@gmail.com
*
**/

;(function (window) {
	
	var orientationChange = {

		//判断是否是竖屏
		isVertical : window.orientation === 0 || window.orientation === 180,

		//判断是否是横屏
		isHorizontal : window.orientation === 90 || window.orientation === -90,

		//横竖屏转换的监听事件
		addListener : function ( func, source ) {
			var supportOrientationChange = 'onorientationchange' in window,
				orientationEvent = supportOrientationChange ? 'orientationchange' : 'resize';

			window.addEventListener( orientationEvent, proxy( func, context ), false);
		}
	};

	//指定函数的运行作用域
	function  proxy( func, context ) {
		var source = context || this;
		return func.bind ? func.bind(source) : function () {
			func.apply( source, arguments );
		};
	}

	window.orientationChange = orientationChange;
})(window);


