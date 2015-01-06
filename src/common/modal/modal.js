var modalComponent = angular.module('angular-modal', ['common-templates']);

modalComponent.factory('angularModal', function ($q, $templateCache, $document, $rootScope, $compile, $controller, $timeout) 
{
    var angularModal = {};
    
    /**
     * Show a new modal window
     */
    angularModal.show = function (options) 
    {
        var modalResultDefer   = $q.defer();
        var modalOpenDefer     = $q.defer();
        
        // Modal window
        var modalWindow = {
            result   : modalResultDefer.promise,
            opened   : modalOpenDefer.promise
        }
        
        // Check options
        if(!options.templateUrl) {
           throw new Error("No template URL specified for modal dialog.");
        }
        
        // Scope
        var modalScope = (options.scope || $rootScope).$new();
        
        modalScope.$close = function (result, params) {
            modalScope.leaving = true;
            
            modalResultDefer.resolve({ result: result, params: params });
            
            var delay = options.closeDelay || 400;
            $timeout(function () {
                modalScope.$destroy();
                element.remove();
            }, delay);
        }
        
        // Controller
        if(options.controller) {
            var locals = {};
            locals.$scope       = modalScope;
            locals.$modalWindow = modalWindow;
            
            if(options.locals) {
                angular.forEach(options.locals, function (value, key) {
                    locals[key] = value; 
                });
            }
            
            var ctrl = $controller(options.controller, locals);
            if(options.controllerAs) {
                modalScope[options.controllerAs] = ctrl;
            }
        }
        
        // Compute element from template and insert it in the DOM
        var body                = $document.find('body');
        var elementTemplate     = angular.element($templateCache.get(options.templateUrl));
        var element             = $compile(elementTemplate)(modalScope); // Link to modal scope
        body.append(element);
        
        // Show
        modalScope.shown = true;
        modalScope.leaving = false;
        
        return modalWindow;
    }
    
    return angularModal;
});

modalComponent.directive('ngModalBox', function () {
    return {
        templateUrl: 'modal/modal-box.html',
        transclude: true,
        replace: true
    }
});