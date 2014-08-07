/*
* 一个简单的操作dom元素的class的库
*@auther: wshp
*version:0.0.1
*
*/

(function (window) {
	var classOperate = {
		
		hasClass : function ( element, className ) {
			if (!element)  return;

			var reg = new RegExp('(?:^|\\s+)' + className +'(?:\\s+|$)');
			return reg.test(element.className);
			
			
		},
		addClass : function ( element, className ) {
			if (!element)  return;

			if(!this.hasClass(element, className)){
				element.className = [element.className, className].join(' ');
			}
		},
		removeClass : function ( element, className ) {
			if (!element)  return;

			if(this.hasClass(element, className)){
				var reg = new RegExp('(?:^|\\s+)' + className +'(?:\\s+|$)', 'g'),
					nowClassName = element.className;

				element.className = nowClassName.replace(reg, '');
			}
		},
		toogleClass : function ( element, className ) {
			if (!element)  return;

			if(this.element.hasClass(className)){
				this.element.removeClass(className);
			}else{
				this.element.addClass(className);
			}
		}
	};

	window.classOperate = classOperate;
})(window);