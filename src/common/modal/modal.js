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
        
        // Check options
        if(!options.templateUrl) {
           throw new Error("No template URL specified for modal dialog.");
        }
        
        // Scope
        var modalScope = (options.scope || $rootScope).$new();
        
        // Compute element from template and insert it in the DOM
        var body                = $document.find('body');
        var elementTemplate     = angular.element($templateCache.get(options.templateUrl));
        var element             = $compile(elementTemplate)(modalScope); // Link to modal scope
        body.append(element);
        
        // `Esc` binding
        var escBinding = function (evt) {
            if(evt.which === 27) {
                evt.preventDefault();
                modalScope.$close(false);
            }
        }
        
        $document.bind('keydown', escBinding);
        
        // Modal window
        var modalWindow = {
            result   : modalResultDefer.promise,
            opened   : modalOpenDefer.promise,
            
            // Animations
            _latestEffect : '',
            effect : function (effectName) {
                element.removeClass('modal-animation-' + this._latestEffect);
                
                this._latestEffect = effectName;
                $timeout(function () {
                    element.addClass('modal-animation-' + effectName);
                }, 0);
            },
            shake : function () {
                this.effect('shake');
            }
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
        
        // Close utility
        modalScope.$close = function (result, params) {
            modalWindow.effect('leaving');
            
            modalResultDefer.resolve({ result: result, params: params });
            
            var delay = options.closeDelay || 400;
            $timeout(function () {
                $document.unbind('keydown', escBinding);
                modalScope.$destroy();
                element.remove();
            }, delay);
        }
        
        // Show
        modalScope.shown = true;
        modalScope.leaving = false;
        
        // Start show effect
        modalWindow.effect('shown');
        
        return modalWindow;
    }
    
    return angularModal;
});

modalComponent.directive('ngModalBox', function ($timeout) {
    return {
        templateUrl: 'modal/modal-box.html',
        transclude: true,
        replace: true
    }
});