angular
    .module('cinApp.models')
    .factory('ModelObjectsStorage', function (ArrayExtend) 
    {
        function ModelObjectsStorage(className)
        {
            this.className = className;
            this._objects  = [];
        }
        
        ModelObjectsStorage.prototype.registerModel = function (model) 
        {
            // console.log('Registered model (' + this.className + ':' + model.id + ')');
            if(!_.contains(this._objects, model)) {
                this._objects.push(model);
            }
        }
        
        ModelObjectsStorage.prototype.removeModel = function (model) 
        {
            // console.log('Removed an instance of: ' + model.id);
            this._objects.remove(model);
        }
        
        ModelObjectsStorage.prototype.updateModels = function (updatedModel) 
        {
            // console.log('Detected change on (' + this.className + ':' + updatedModel.id + ')');
            var _this = this;
            
            angular.forEach(this._objects, function (object) 
            {
                if(object.id === updatedModel.id) {
                    // console.log('Updating object ' + updatedModel.id);
                    object._mergeFromObject(updatedModel);
                    
                    // Update relations
                    angular.forEach(object.attributes, function (value, attrName) {
                        if(value instanceof Parse.Relation) {
                            // console.log('Updating relation: ' + attrName);
                            object.attributes[attrName] = new Parse.Relation(object, attrName);
                            object.attributes[attrName].targetClassName = value.targetClassName;
                        }
                    });
                }
            });
            
            // console.log('Analyzed ' + this._objects.length + ' objects for change on class ' + this.className);
        }
        
        return ModelObjectsStorage;
    })
    .factory('modelUpdater', function (ModelObjectsStorage) 
    {
        var self = {};
        var _modelObjectsStorages = {};
        
        self.registerModel = function (className, model) 
        {
            if(!_modelObjectsStorages[className]) { 
                _modelObjectsStorages[className] = new ModelObjectsStorage(className); 
            }
            
            _modelObjectsStorages[className].registerModel(model);
            return _modelObjectsStorages[className];
        }
        
        return self;
    })
    .run(function ($q, $window, modelUpdater) 
    {
        if(!angular.isUndefined($window.Parse) && angular.isObject($window.Parse) && !$window.Parse.__modelStorageExtend__)
        {
            var Parse = $window.Parse;
            Parse.__modelStorageExtend__ = true;
            
            var originalExtend = Parse.Object.extend;
            
            Parse.Object.extend = function (protoProps) 
            {   
                var newClass = originalExtend.apply(this, arguments);
                
                // In case className is passed as first attribute (string)
                var className = angular.isString(protoProps) ? protoProps : protoProps.className; 
                
                /**
                 * Add initializer registration
                 */
                var originalInitialize = newClass.prototype.initialize;
                newClass.prototype.initialize = function () 
                {
                    originalInitialize.apply(this, arguments);
                    
                    // Register
                    this._modelObjectsStorage = modelUpdater.registerModel(className, this);
                }
                
                /**
                 * When `$save` is finished, we need to update all objects with the sameId.
                 */
                var originalSave = newClass.prototype.$save;
                newClass.prototype.$save = function () 
                {
                    var _this = this;
                    return originalSave
                        .apply(this, arguments)
                        .then(function (saved) {
                            _this._modelObjectsStorage.updateModels(_this);
                            return saved;
                        });
                }
                
                /**
                 * When `$destroy` is finished, we need to remove this object from _modelObjectsStorage
                 */
                var originalDestroy = newClass.prototype.$destroy;
                newClass.prototype.$destroy = function () 
                {
                    var _this = this;
                    return originalDestroy
                        .apply(this, arguments)
                        .then(function (result) {
                            _this._modelObjectsStorage.removeModel(_this);
                            return result;
                        });
                }
                
                return newClass;
            }
        }
    });