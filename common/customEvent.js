/*
*自定义事件的实现
*观察者模式的具体实现
*@author: wshp
*@E-mail: wshp000000@gmail.com
*@version : 0.0.2
**/

;(function () {
	var slice = Array.prototype.slice;
	
	function CustomEvent () {

		//保存注册事件的对象
		this.eventList = {};

	}

	CustomEvent.prototype = {

		constructor: CustomEvent,

		//注册自定义事件
		addEvent : function ( eventName, func ) {
			var args = arguments,
				argsLen = args.length,
				i, len;
			if ( typeof eventName === 'string' && typeof func === 'function' ) {
				if ( typeof this.eventList[eventName] === 'undefined' ) {
					this.eventList[eventName] = [];
				}

				for( i = 1, len = argsLen; i < len; i++){
					this.eventList[eventName].push(args[i]);
				}

			}

			return this;
		},


		//触发自定义事件
		fire : function ( eventName , func ) {
			var args = arguments,
				argsLen = args.length,
				funcArr,
				i, len;

			if ( typeof eventName === 'string' ) {
				funcArr = this.eventList[eventName];

				
				if ( argsLen === 1) {
					//触发这个自定义事件的所有回调函数
					for ( i = 0, len = funcArr.length; i < len; i++) {
						funcArr[i].apply( this, arguments );
					}
				} else if( argsLen > 1 ){ 
					//触发传入的回调函数
					for( i = 1; i < argsLen; i++ ){
						if ( isInArray( funcArr, args[i]) ) {
							args[i].apply( this, arguments );
						}
					}
				}
			}

			return this;
		},

		//删除自定义事件
		removeEvent : function ( eventName, func ) {
			var args = arguments,
				argsLen = args.length,
				funcArr,
				i, len;

			if ( typeof eventName === 'string' ) {
				if( argsLen === 1){
					delete this.eventList[eventName];
				} else if ( argsLen > 1) {
					for( i = 1; i < argsLen; i++ ){
						if ( isInArray( this.eventList[eventName], args[i]) ) {
							this.eventList[eventName ] = removeArrParam( this.eventList[eventName ], args[i]);
						}
					}
				}
			}

			return this;
		}

	};


	//判断一个数组中是否含有某个值
	function isInArray ( arr, param ){
		var result = false,
			i, len;

		if ( typeof arr === 'object' && toString.apply(arr) === '[object Array]') {
			for( i = 0, len = arr.length; i < len; i++ ){
				if ( arr[i] === param ) {
					result = true;
					break;
				}
			}
		}

		return result;
	}

	//删除数组中的某个值
	function removeArrParam ( arr , param ){
		var arrStr,
			res,
			i, len, index;

		if ( typeof arr === 'object' && toString.apply(arr) === '[object Array]') {
			if ( typeof param === 'string' || typeof param === 'number') {
				res = new RegExp('' + param + ',|,' + param +'$');
				arrStr = arr.join(',');
				arr = arrStr.replace(res, '').split(',');
			} else if ( typeof param === 'function' || ( typeof param === 'object' && param !== null ) ){
				for( i = 0, len = arr.length; i < len; i++){
					if ( arr[i] === param ) {
						index = i;
						break;
					}
				}
				arr = remove( arr, index );
			}
		}

		return arr;
	}

	//根据下标删除数组中的元素,并返回数组
	function remove (arr, index) {
		if( typeof arr === 'object' && toString.call(arr) === '[object Array]' && index >= 0){
			return arr.remove ? arr.remove(index) : arr.slice(0, index).concat(arr.slice( index + 1, arr.length));
		}
	}

	CustomEvent.prototype.on = CustomEvent.prototype.addEvent;
	CustomEvent.prototype.off = CustomEvent.prototype.removeEvent;

	window.CustomEvent = CustomEvent;
})(window);