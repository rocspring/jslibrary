/*
*移动端横竖屏转换事件的监听
*@author: wshp
*@E-mail: wshp000000@gmail.com
*@version:0.2.0
**/

;(function (window) {
	var userAgent = window.navigator.userAgent,
		isAndroid = /Android/i.test(userAgent),
		isXiaoMi = /MI\s\d/i.test(userAgent);

	var orientationChange = {

		//添加的事件队列
		eventsArr : [],

		//判断是否是竖屏
		isVertical : window.orientation === 0 || window.orientation === 180,

		//判断是否是横屏
		isHorizontal : window.orientation === 90 || window.orientation === -90,

		//增加一个监听事件
		on : function ( func, context ) {
			var that = this;

			var source = context || window;
			that.eventsArr.push({
				func : func,
				source : source
			});
		},

		//取消一个监听事件
		off : function ( func, context ) {
			var that = this,
				i,
				len = that.eventsArr.length,
				arr = that.eventsArr,
				source = context || window;

			if ( typeof func === 'function' || len === 0 ) return;

			for( i = 0; i < len; i ++ ){
				if(arr[i].func === func && source === arr[i].source ){
					that.eventsArr = remove( arr, i );
					break;
				}
			}
		},

		//取消所有的监听事件
		destory : function () {
			var that = this;
			window.removeEventListener( 'orientationchange', that._executionOrientationchangeEvents, false);
			window.removeEventListener( 'resize', that._excutionResizeEvents, false);

			//保留，可能提供新的接口，供重新监听这些事件
			// this.eventsArr = [];

		},

		//执行所有的orientationchange事件
		_executionOrientationchangeEvents : function () {
			var that = this,
				i,
				len = that.eventsArr.length,
				arr = that.eventsArr;

			if ( len === 0 ) return; 

			for ( i = 0; i < len; i++ ){
				createOrientationChangeProxy( arr[i].func, arr[i].source )();
			}
			
		},

		//执行所有的resize事件
		_excutionResizeEvents : function () {
			var that = this,
				i,
				len = that.eventsArr.length,
				arr = that.eventsArr;

			if ( len === 0 ) return;
			
			for ( i = 0; i < len; i++ ){
				delay( proxy( arr[i].func, arr[i].source ) );
			}
		},

		//监听事件
		_addListener : function () {
			var supportOrientationChange = 'onorientationchange' in window,
				orientationEvent = supportOrientationChange ? 'orientationchange' : 'resize',
				that = this;

			window.addEventListener( 'orientationchange',  proxy( that._executionOrientationchangeEvents, that ), false);
			window.addEventListener( 'resize', proxy( that._excutionResizeEvents, that ), false);
		}
	};

	//开始监听事件
	orientationChange._addListener();

	//创建横竖屏转换的代理，处理andrior手机的延迟问题
	//learn from zhangdaiping
	function createOrientationChangeProxy ( func, context ) {
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

				func.lastOrientation = ori;

			}, delay);

		};
	}

	//延迟处理一个函数
	function delay ( func, time ){
		var timer,
			defer = time || 100;

		clearTimeout(timer);
			timer = setTimeout(function () {
				timer = null;
				func();
			}, defer);
		
	}

	//给一个函数绑定执行作用域
	function proxy ( func, context ) {
		var source = context || this;

		return func.bind ?  func.bind(source) : function () {
			func.apply(source, arguments);
		};
	}

	//给数组添加一个删除元素方法
	function remove (arr, index) {
		if( typeof arr === 'object' && toString.call(arr) === '[object Array]' && index >= 0){
			return arr.remove ? arr.remove(index) : arr.slice(0, index).concat(arr.slice( index + 1, arr.length));
		}
	}


	var exposureInterface = {
		
	};
	window.orientationChange = orientationChange;
})(window);
