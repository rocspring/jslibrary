/*
*jsonp的封装
*@author: wshp
*@E-mail: wshp000000@gmail.com
*@version: 1.1.0
**/

;(function () {
	var document = window.document;

	function Jsonp (opts) {
		this.url = opts.url || '';
		this.data = opts.data || null;
		this.success = opts.success || null;
		this.error = opts.error || null;

		this.callbackName = '';

		this.init();
	}

	Jsonp.prototype = {

		init : function () {
			this.setParams();
			this.createJsonp();
		},

		setParams : function () {
			this.url = this.url + (this.url.indexOf('?') === -1 ? '?' : '&') + params(this.data) + '&_time_=' + (new Date() * 1);

			if (/callback=(\w+)/.test(this.url)) {
				this.callbackName = RegExp.$1;
			}else{
				this.callbackName = 'jsonp_' + (new Date() * 1) + '_' + Math.random().toString().substring(2,15);
				this.rul.replace( 'callback=?', 'callback=' + this.callbackName);
				this.rul.replace( 'callback=%3F', 'callback=' + this.callbackName);
			}
		},

		createJsonp : function () {

			var head = document.getElementsByTagName('head'),
				scriptTag = this.createScriptTag();

			if ( head && head[0] ) {
				head[0].appendChild(scriptTag);
			}		
		},

		createScriptTag : function () {
			var that = this,
				scriptTag = document.createElement('script'),
				name = that.callbackName;

			// scriptTag.type = 'text/script';
			scriptTag.src = that.url;
			scriptTag.id = 'id_' + that.callbackName;

			window[name] = function (json) {
				window[name] = null;

				var element = document.getElementById('id_' + that.callbackName);
				that.removeScriptTag(element);

				//真正的处理返回的数据的函数
				that.success(json);
			};

			scriptTag.onerror = that.error;

			return scriptTag;
		},

		removeScriptTag : function (element) {
			removeElement(element);
		}
	};

	//删除一个节点
	function removeElement (element) {
		var parent = element.parentNode;
		if ( element && parent.nodeType !== 11) {
			parent.removeChild(element);
		}	
	}

	//把对象转换为序列化的字符串
	function params (obj) {
		var i,
			arr = [];

		if ( typeof obj === 'object' && !!obj ) {
			for( i in obj ){
				if (obj.hasOwnProperty(i)) {
					arr.push(i + '=' + obj[i] );
				}
			}
			return arr.join('&');
		}
	}	
	
window.Jsonp = Jsonp;
})(window);
