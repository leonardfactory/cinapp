var modalComponent = angular.module('angular-modal', ['shared-templates', 'lfEffects']);

modalComponent.factory('angularModal', function ($q, $templateCache, $document, $rootScope, $compile, $controller, $timeout, lfAnimator) 
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
        
        var containerElement    = element.find('.modal-container');
        
        // Body should not be scrollable when modal is opened
        body.addClass('noscroll');
        
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
            effect : function (effectName) {
                lfAnimator.applyEffect(element, 'modal-animation-' + effectName, 400/*ms*/);
            },
            shake : function () {
                this.effect('shake');
            },
            successed : function () {
                this.effect('successed');
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
                // Unbind keydown
                $document.unbind('keydown', escBinding);
                
                // Allow body sto scroll again
                body.removeClass('noscroll');
                
                // Remove scope & DOM element
                modalScope.$destroy();
                element.remove();
            }, delay);
        }
        
        // Show
        modalScope.shown = true;
        
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