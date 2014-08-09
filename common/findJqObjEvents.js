/*
*引用Jquery时，获取DOM对象上注册的事件
*
*@param {Object} dom: 希望查找的DOM元素
*@param {String} eventName: 希望获取的事件名称
*
*@return 传入事件名称时，返回这个事件的函数；否则，返回dom对象上所有的事件
**/

function findDomEventsInJquery ( dom, eventName ) {
	if (!dom) return;

	var eventsObj = $._data( dom, 'events' );

	return !!eventName ? (eventsObj[eventName][0] ? eventsObj[eventName][0] : null) : eventsObj;
}
