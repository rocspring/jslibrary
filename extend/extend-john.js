/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function() {
    var initializing = false,
        fnTest = /xyz/.test(function() {
            xyz;
        }) ? /\b_super\b/ : /.*/;

    // 自执行的匿名函数，this指向的是全局变量，一般指代window
    // 这段代码的目的是在全局变量上挂一个Class，相当于一个类
    // The base Class implementation (does nothing)
    this.Class = function() {}; 

    // 这的Class指代就是全局变量上挂着的Class
    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        // 这里的this指向调用extend方法的对象，一般情况下指的是类(即构造函数)
        var _super = this.prototype;

        // 实例化一个类的对象。
        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // 这段代码的目的是把传入的对象的方法和属性扩充到这个类的实例上
        // 属性是直接覆盖父类的属性
        // 方法是返回了一个闭包
        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn) {
                    return function() {
                        var tmp = this._super;

                        // 只有在调用一个类的基本方法的时候，_super才指的是父类的同名方法
                        // 其他情况下，_super是自己指定的
                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);

                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        /**
        * extend方法返回一个构造函数。
        * 通过原型来实现继承的,同时prototype属性上也扩充了传入的对象的属性和方法。
        * 同时所有的构造函数都有一个可以绑定在函数对象上的extend方法。
        */

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // 
        // And make this class extendable
        Class.extend = arguments.callee;

        // 返回一个构造函数(就是返回一个类)
        return Class;
    };


})();


var Base = Class.extend({
    init: function() {
        console.log('base');
    }
});

var Test = Base.extend({
    init: function() {
        this._super();
        console.log('test');
    }
});

// Test.prototype.init = new Base().init

var t = new Test();