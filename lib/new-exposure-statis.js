/**
* @desc new exposure Statistics :新版曝光的统计
* @author: wshp
* @E-mail:wshp000000@gmail.com
* @version: 0.0.1
* 
* @version: 0.0.2 提供设置判断一个元素曝光时距离屏幕底部的高度(大于0时，表明元素超出屏幕底部；小于0时，表明元素还在屏幕下方)
* @version: 0.0.3 简化对外提供接口的名称
*/

(function (window) {

	var utils = {

		// 给数组添加一个删除元素方法
		remove: function(arr, index) {
			if (typeof arr === 'object' && toString.call(arr) === '[object Array]') {
				if (typeof index === 'number' && index >= 0) {
					return arr.remove ? arr.remove(index) : arr.slice(0, index).concat(arr.slice(index + 1, arr.length));
				} else if (typeof index === 'object' && toString.call(index) === '[object Array]') {
					//传入一个下标数组，删除这些元素
					var newArr = [];
					for (var i = 0, len = index.length; i < len; i++) {
						arr[index[i]] = void 0;
					}

					for (var j = 0, arrLen = arr.length; j < arrLen; j++) {
						if (arr[j] !== void 0) {
							newArr.push(arr[j]);
						}
					}

					return newArr;
				}

			}
		},

		// 获取网页超出屏幕的高度
		getScrollY: function() {
			return window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
		},

		// 获取元素距离页面顶部的高度
		getOffsetTop: function(dom) {
			var top = 0;

			while (dom.offsetParent && 　dom.offsetParent !== '') {
				top = top + dom.offsetTop;
				dom = dom.offsetParent;
			}

			return top;
		},

		// 指定函数的运行作用域
		proxy: function(fun, context) {
			var source = context || this;

			return function() {
				fun.apply(source, arguments);
			};
		},

		// 扩展对象的属性
		extend: function(c, p) {
			var isObject = function(p) {
				return Object.prototype.toString.call(p) === '[object Object]';
			};

			if (!isObject(c) || !isObject(p)) return;

			for (var i in p) {
				if (p.hasOwnProperty(i)) {
					c[i] = p[i];
				}
			}

			return c;
		}
	};

	var document = window.document,
		innerHeight = window.innerHeight,
		innerWidth = window.innerWidth,
		body = document.body;

	/**
	 * @param {Array} domArr : // 所有要统计的曝光元素数组
	 *	每个值的格式
	 *		{
     *          dom: domObj, // dom对象
	 *			callback : function() {}   // 曝光以后的回调函数 
	 *			overHeight: {Number} // 判断元素是否曝光时，距离屏幕底部的高度(可以不传)
	 *		}
	 * 兼容只传入一个对象的情况
	 *	有两个外部可以调用的接口:
	 *  1. add 添加新的曝光元素 (添加的参数和初始化的参数相同)
	 *  2. once 页面没有滚动的情况下，主动统计一次元素的曝光
	 */

	function NewExposureStatis ( domArr ) {

		this.domArr = [];
		//setTimeout对象
		this.statisticsTimer = null;

		this.init( domArr );
	}

	NewExposureStatis.prototype = {

		// 统计的间隔时间
		intervalTime : 100,

		init : function ( domArr ){

			this.add( domArr )
				.once()
				.addExposureListen( );
		},

		// 对外提供的添加曝光元素的接口
		add : function(inputParameter) {
			this.addNewElements(inputParameter);

			return this;
		},

		// 添加新的曝光统计元素(传入的参数是dom数组,和初始化是传入的数据一样)
		addNewElements : function ( inputParameter ) {
			if( this.domArr.length === 0){
				this.removeExposureListen();
				this.addExposureListen( );
			}

			// 传入的是dom数组时
			if ( toString.call(inputParameter) === '[object Array]' && inputParameter.length !== 0){
				var len = inputParameter.length,
					i;
				for ( i = 0; i < len; i++ ) {
					this._addElement(inputParameter[i]);
				}
			} else if ( toString.call(inputParameter) === '[object Object]' && !!inputParameter.dom ) {
				this._addElement(inputParameter);
			}
		},

		// 对外提供的主动统计曝光一次的接口
		once: function() {
			this.sendFirstScreenStatis();

			return this;
		},

		// 未滚动的情况下，直接发送首屏已曝光的元素
		sendFirstScreenStatis : function () {
			var that = this;
			//判断所有的元素是否曝光
			this.allIsExposure(that.domArr);

			return that;
		},

		// 添加曝光监听
		addExposureListen : function () {
			var that = this;

			window.addEventListener( 'scroll', utils.proxy( that.exposureListenFunc, that), false );
		},

		// 移除曝光监听
		removeExposureListen : function () {
			var that = this;

			window.removeEventListener( 'scroll', utils.proxy( that.exposureListenFunc, that), false);
		},

		// 曝光监听函数
		exposureListenFunc : function () {
			var that = this;
			// that.allIsExposure(that.domArr);

			clearInterval(that.statisticsTimer);
			that.statisticsTimer = setTimeout(function () {
					that.allIsExposure(that.domArr);
				}, that.intervalTime);

		},

		// 对所有的监听元素，判断是否曝光
		allIsExposure : function ( arr ) {
			var i,
				len = arr.length,
				domArr = this.domArr,
				indexArr = [],
				isExpos = false,
				tempCallback = function(){};

			//没有监听元素时
			if (len === 0) {
				this.removeExposureListen();
				return;
			}

			for ( i = 0; i < len; i++) {
				if (!!domArr[i].overHeight) {
					isExpos = this.isExposure(domArr[i].dom, domArr[i].overHeight);
				} else {
					isExpos = this.isExposure(domArr[i].dom);
				}
				

				if(isExpos){
					indexArr.push(i);
					if(!!domArr[i].callback){
						tempCallback = domArr[i].callback;
						tempCallback();
					}
				}
			}

			this.removeElement(indexArr);
		},

		// 增加一个监听元素
		_addElement : function ( domObj ) {
			var that = this;
 
            that.domArr.push(domObj);
		},

		// 删除指定的监听元素
		removeElement : function ( indexArr ) {
			this.domArr = utils.remove(this.domArr, indexArr );
		},

		// 判断dom元素是否曝光
		// 返回Boolean值
		isExposure : function ( domObj , overHeight ) {
			var overScreenHeight, //网页超出屏幕的高度
				distanceTopHeight,//元素距离页面顶部的高度
				distance = overHeight || 10;

			if( domObj ) {
				overScreenHeight = utils.getScrollY();
				distanceTopHeight = utils.getOffsetTop(domObj);
				
				return ( distanceTopHeight > overScreenHeight && distanceTopHeight - overScreenHeight < innerHeight - distance ) ? true : false;
			}

			return false;
		}

	};

	if( typeof define === 'function' && (define.amd || seajs) ){
		define('NewExposureStatis', [], function(){
			return NewExposureStatis;
		});
	}else if ( typeof module != 'undefined' && module.exports ) {
		module.exports = NewExposureStatis;
	}

	window.NewExposureStatis = NewExposureStatis;

})(window);