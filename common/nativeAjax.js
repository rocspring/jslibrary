/*
*封装ajax
*@author：wshp
*@E-mail: wshp000000@gmail.com
*version: 1.0.0
**/

(function (window) {
	var body;

	function NativeAjax (opts) {

		this.type = opts.type || 'GET';
		this.url = opts.url || '';
		this.data = opts.data || '';
		this.dataType = opts.dataType || 'json';
		this.async = opts.async || true;
		this.success = opts.success;
		this.error = opts.error;

		this.XHR = null;

		this.init();
	}

	NativeAjax.prototype = {

		init : function  () {
			this.createXHR();
			this.setXHR();
			this.open();
			this.send();
		},

		//创建XHR对象
		createXHR : function () {
			var xhr;

			if (window.ActiveXObject) {
				xhr = new ActiveXObject("microsoft.xmlhttp");
			}else if(window.XMLHttpRequest) {
				xhr = new XMLHttpRequest();
			}

			this.XHR = xhr;
		},

		setXHR : function () {

			this.XHR.onreadystatechange = this._readyStateChange;

			if ( this.type === 'get' || this.type === 'GET' ) {
				this.type = 'GET';
				if (this.data) {
					this.url = this.url + '?' + params(this.data);
				}
			}else if ( this.type === 'post' || this.type === 'POST' ) {
				this.type = 'POST';
				this.XHR.setRequestHeader("content-type","application/x-www-form-urlencoded");
			}else {
				console.log('error');
			}

			if (this.dataType === 'text' || this.dataType === 'TEXT') {
				this.dataType = 'text';
			}else if(this.dataType === 'xml' || this.dataType === 'XML'){
				this.dataType = 'xml';
			}else if(this.dataType === 'json' || this.dataType === 'JSON'){
				this.dataType = 'json';
			}

		},

		open : function () {
			this.XHR.open( this.type, this.url, this.async );
		},

		send : function () {
			var that = this;

			if (this.type === 'GET') {
				this.XHR.send(null);
			}else if(this.type === 'POST'){
				this.XHR.send(that.data);
			}
		},

		stop : function () {
			if (this.XHR) {
				this.XHR.abort();
			}
		},

		_readyStateChange : function () {
			var XHR = this.XHR;
			if (XHR.readyState === 4 && XHR.status === 200 && this.success) {
				if (this.dataType === 'text') {
					this.success(XHR.responseText);
				}else if ( this.dataType === 'xml' ) {
					this.success(XHR.responseXML);
				}else if ( this.dataType === 'json' ){
					this.success(eval('(' + XHR.responseText + ')'));
				}
			}
		}

	};

	//把对象转换为序列化的字符串
	function params (obj) {
		var i,
			arr;

		if ( typeof obj === 'object' && !!obj ) {
			for( i in obj ){
				if (obj.hasOwnProperty(i)) {
					arr.push(i + '=' + obj[i] );
				}
			}
			return arr.join('&');
		}
	}

	window.NativeAjax = NativeAjax;

})(window);