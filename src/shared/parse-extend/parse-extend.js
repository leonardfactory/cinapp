(function (window, undefined) 
{
    var angular = window.angular;
    if(angular !== undefined) 
    {
        var module = angular.module('parse-extend', []);
        
        /**
        * Extends Parse so that we have properties (using `Object.defineProperty`) inside
        * of getters and setters only as provided by Parse JS SDK.
        */
        module.run(function ($q, $window) 
        {
            if(!angular.isUndefined($window.Parse) && angular.isObject($window.Parse))
            {
                var Parse = $window.Parse;

                /*
                 * Methods to update on global object
                 */
                var methodsToUpdate = {
                    "Object": {
                        proto: ['save', 'fetch', 'destroy'],
                        static: ['saveAll', 'destroyAll']
                    },
                    "Collection": {
                        proto: ['fetch'],
                        static: []
                    },
                    "Query": {
                        proto: ['find', 'first', 'count', 'get'],
                        static: []
                    },
                    "Cloud": {
                        proto: [],
                        static: ['run']
                    },
                    "User": {
                        proto: ['signUp'],
                        static: ['requestPasswordReset', 'logIn']
                    },
                    "FacebookUtils": {
                        proto: [],
                        static: ['logIn', 'link', 'unlink']
                    }
                };
                
                /*
                 * Patch Parse methods in order to use $q promises
                 */
                angular.forEach(methodsToUpdate, function (className, currentObject)
                {   
                    // Patch prototype methods
                    angular.forEach(currentObject.proto, function (methodName) 
                    {
                        var originalMethod = Parse[currentClass].prototype[methodName];
                        
                        Parse[currentClass].prototype[methodName] = function () 
                        {
                            var deferred = $q.defer();
                            console.log('Applying: ' + currentClass + '->' + methodName);
                            originalMethod
                                .apply(this, arguments)
                                .then(function (data) {
                                    console.log(data);
                                    deferred.resolve(data);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            console.log('Applied: ' + methodName);
                                
                            return deferred.promise;
                        }
                    });
                    
                    // Patch static methods
                    angular.forEach(currentObject.static, function (methodName) 
                    {
                        var originalMethod = Parse[currentClass][methodName];
                        
                        Parse[currentClass][methodName] = function () 
                        {
                            var deferred = $q.defer();
                            
                            originalMethod
                                .apply(this, arguments)
                                .then(deferred.resolve, deferred.reject);
                                
                            return deferred.promise;
                        }
                    });
                });
                
                /*
                 * Patch Parse Objects in order to use Object.defineProperty
                 * instead of classic get('property') & set('property', value)
                 *
                 * Furthermore, add a simple `toObject` method to convert
                 * the Parse.Object to a POJO.
                 */
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