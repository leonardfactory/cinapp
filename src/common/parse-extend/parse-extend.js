(function (window, undefined) 
{
    var angular = window.angular;
    if(angular !== undefined) 
    {
        var module = angular.module('parse-extend', ['parse-angular']);
        
        /**
         * Extends Parse so that we have properties (using `Object.defineProperty`) inside
         * of getters and setters only as provided by Parse JS SDK.
         */
        module.run(function ($q, $window) 
        {
             if(!angular.isUndefined($window.Parse) && angular.isObject($window.Parse))
             {
                 var Parse = $window.Parse;
                 
                 var originalObjectExtend = Parse.Object.extend;
                 
                 Parse.Object.extend = function (prototypeProps) 
                 {
                     var newClass = originalObjectExtend.apply(this, arguments);
                     
                     if(Parse._.isObject(prototypeProps) && Parse._.isArray(prototypeProps.attrs))
                     {
                         // Define properties
                         angular.forEach(prototypeProps.attrs, function (attr) 
                         {
                             Object.defineProperty(newClass.prototype, attr, {
                                 enumerable: true,
                                 configurable: true,
                                 get: function () { return this.get(attr); },
                                 set: function (value) { this.set(attr, value); return this; }
                             });
                         });
                         
                         // Plain-Object converter
                         newClass.prototype.toObject = function () 
                         {
                             var obj = {};
                             var _this = this;
                             angular.forEach(prototypeProps.attrs, function (attr) {
                                 obj[attr] = _this.get(attr);
                             });
                             return obj;
                         }
                     }
                     
                     return newClass;
                 }
             }
        });
    }
})(this);