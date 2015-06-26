/**
* @desp: 对页面错误的监控和报告
* @author： wshp000000@gmail.com
* @version: 0.1.0
*
*/

;(function (window) {
	
	function errorHandle(msg, url, line){
		console.log( msg + url + line );
	}


	if (window.onerror === null) {
		window.onerror = errorHandle;
	}

})(window);