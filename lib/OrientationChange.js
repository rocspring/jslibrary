/*
*移动端横竖屏转换事件的监听
*@author: wshp
*@E-mail: wshp000000@gmail.com
*
**/

;(function (window) {
	var userAgent = window.navigator.userAgent,
		isAndroid = /Android/i.test(userAgent),
		isXiaoMi = /MI\s\d/i.test(userAgent);

	var orientationChange = {

		//判断是否是竖屏
		isVertical : window.orientation === 0 || window.orientation === 180,

		//判断是否是横屏
		isHorizontal : window.orientation === 90 || window.orientation === -90,

		//横竖屏转换的监听事件
		addListener : function ( func, source ) {
			var supportOrientationChange = 'onorientationchange' in window,
				orientationEvent = supportOrientationChange ? 'orientationchange' : 'resize';

			window.addEventListener( orientationEvent, createOrientationChangeProxy( func, context ), false);
		}
	};

	//创建横竖屏转换的代理，处理andrior手机的延迟问题
	//learn from zhangdaiping
	function  createOrientationChangeProxy( func, context ) {
		return function () {
			clearTimeout(func.orientationChangeTimer);

			var args = Array.prototype.slice.call(arguments, 0),

				// 对Android横竖屏抓换时使用延迟，在横竖屏转换时，屏幕高宽并不能立即生效
                // 有的Android少于400ms高宽就能生效，有的就会超过400ms
                // 小米自带浏览器延迟尤其厉害，原因未知
				delay = isAndroid ? (isXiaoMi ? 1000 : 400) : 0;

			func.orientationChangeTimer = setTimeout(function () {
				var ori = window.orientation;

				if (ori !== func.lastOrientation) {
					func.apply(context, args);
				}

				func.lastOrientation = ori.orientation;

			}, delay);

		};
	}

	window.orientationChange = orientationChange;
})(window);


