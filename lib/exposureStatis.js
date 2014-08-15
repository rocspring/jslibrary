/*
*exposure Statistics :曝光的统计
*@author: wshp
*@E-mail:wshp000000@gmail.com
*依赖发送统计的组件，statistics.js
*
**/

(function () {
	var document = window.document,
		Statistics = window.Statistics,
		innerHeight = window.innerHeight,
		innerWidth = window.innerWidth,
		body = document.body,
		baseUrl = ''; //默认的发送统计链接

	/*
	*@param {Object} rootDom : 某块需要统计曝光的DOM元素，默认为body
	*
	*@param {String} exposureCode : 曝光码
	**/

	function ExposureStatis ( rootDom, exposureCode ) {

		this.rootDom = rootDom || body;
		this.exposureCode = exposureCode || '';
		//所有要统计的曝光元素数组
		/********
		*每个值的格式
		*	{
		*		dom: domObj, //dom对象
				param : {}   //参数对象
		*	}
		***************/
		this.domArr = [];
		//setTimeout对象
		this.statisticsTimer = null;

		this.init( this.rootDom );
	}

	ExposureStatis.prototype = {

		//统计的间隔时间
		intervalTime : 100,

		init : function ( rootDom ){

			this.addElements( rootDom );
			this.addExposureListen( );
		},

		//添加所有的曝光统计元素
		addElements : function ( rootDom ) {
			var aTagArr = rootDom.getElementsByTagName('a'),
				len = aTagArr.length,
				i;

			if (len === 0) return;
			
			for ( i = 0; i < len; i++ ) {
				this.addElement(aTagArr[i]);
			}
		},

		//添加新的曝光统计元素(传入的参数是dom数组)
		addNewElements : function ( newDomArr ) {
			if ( toString.call(newDomArr) !== '[object Array]' || newDomArr.length === 0) return;

			if( this.domArr.length === 0){
				this.removeExposureListen();
				this.addExposureListen( );
			}else{
				var len = newDomArr.length,
					i;
				for ( i = 0; i < len; i++ ) {
					this.addElement(newDomArr[i]);
				}
			}
		},

		//添加曝光监听
		addExposureListen : function () {
			var that = this;

			window.addEventListener( 'scroll', proxy( that.exposureListenFunc, that), false );
		},

		//移除曝光监听
		removeExposureListen : function () {
			var that = this;

			window.removeEventListener( 'scroll', proxy( that.exposureListenFunc, that), false);
		},

		//曝光监听函数
		exposureListenFunc : function () {
			var that = this;
			// that.allIsExposure(that.domArr);

			clearInterval(that.statisticsTimer);
			that.statisticsTimer = setTimeout(function () {
					that.allIsExposure(that.domArr);
				}, that.intervalTime);

		},

		//对所有的监听元素，判断是否曝光
		allIsExposure : function ( arr ) {
			var i,
				len = arr.length,
				domArr = this.domArr;

			//没有监听元素时
			if (len === 0) {
				this.removeExposureListen();
				return;
			}

			for ( i = 0; i < len; i++) {
				var isEXpos = this.isExposure(domArr[i].dom);

				if(isEXpos){
					Statistics.addStatistics(domArr[i].param);
					this.removeElement(i);
				}
			}
		},

		//增加一个监听元素
		addElement : function ( domObj ) {
			var that = this,
				domUrl = domObj.getAttribute('href');
			if(/\/([np])\/(\d+)/.test(domUrl)){
				//TODO 可以提供一个接口，来传入判读函数
				//需要监听的曝光元素的判断条件
				var tempObj = {};

				tempObj.dom = domObj;
				tempObj.param = {
					_once_: that.exposureCode,
					type : RegExp.$1,
					id : RegExp.$2,
					rdm : Math.random().toString().substring(2,15)
				};

				this.domArr.push(tempObj);
			}
		},

		//删除一个监听元素
		removeElement : function ( index ) {
			this.domArr = remove(this.domArr, index);
		},

		//判断dom元素是否曝光
		//返回Boolean值
		isExposure : function ( domObj ) {
			var overScreenHeight, //网页超出屏幕的高度
			distanceTopHeight;//元素距离屏幕顶部的高度
			if( domObj ) {
				overScreenHeight = getScrollY();
				distanceTopHeight = domObj.offsetTop;
				
				return ( distanceTopHeight > overScreenHeight && distanceTopHeight - overScreenHeight < innerHeight -10) ? true : false;
			}

			return false;
		}

	};

	window.ExposureStatis = ExposureStatis;

	//给数组添加一个删除元素方法
	function remove (arr, index) {
		if( typeof arr === 'object' && toString.call(arr) === '[object Array]' && index >= 0){
			return arr.remove ? arr.remove(index) : arr.slice(0, index).concat(arr.slice( index + 1, arr.length));
		}
	}

	//获取网页超出屏幕的高度
	function getScrollY() {
		return window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
	}

	//指定函数的运行作用域
	function  proxy ( fun, context ) {
		var source = context || this;

		return fun.bind ?  fun.bind(source) : function () {
			fun.apply(source, arguments);
		};
	}
})(window);