/*
*js继承的实现
*@author: John Resig
*实现的目标：
*1.Klass是一个基类，所有的类都是从Klass类继承的
*2.任何一个新的类都是从现有的类扩展开的，最初始的类是Klass类
*3.子类可以调用父类的同名方法
*
**/

;(function () {

	var initializing = true,
		fnTest = /xyz/.test(function () { 'xyz';}) ? /\b_super\b/ : /.*/;//判断浏览器是否支持函数序列化

	function Klass (){
		
	}

})();


