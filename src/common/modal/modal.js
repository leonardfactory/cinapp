var modal = angular.module('angular-modal', ['common-templates']);

modal.factory('angularModal', function ($q, $templateCache, $document, $rootScope, $compile, $timeout) 
{
    var angularModal = {};
    
    /**
     * Show a new modal window
     */
    angularModal.show = function (options) 
    {
        var deferred = $q.defer();
        
        // Check options
        if(!options.templateUrl) {
            deferred.reject("No template URL specified for modal dialog.");
        }
        
        // Scope
        var modalScope = $rootScope.$new();
        
        var closeDeferred = $q.defer();
        modalScope.close = function (result) {
            closeDeferred.resolve(result);
        }
        
        // Compute element from template and insert it in the DOM
        var body                = $document.find('body');
        var elementTemplate     = angular.element($templateCache.get(options.templateUrl));
        var element             = $compile(elementTemplate)(modalScope); // Link to modal scope
        body.append(element);
        
        // Show
        modalScope.shown = true;
        
        // Close and remove scope + DOM element
        closeDeferred.promise.then(function (result) {
            modalScope.shown = false;
            
            var delay = options.closeDelay || 0;
            $timeout(function () {
                modalScope.$destroy();
                element.remove();
            
                deferred.resolve(result);
            }, delay);
        });
        
        return deferred.promise;
    }
    
    return angularModal;
});

modal.directive('ngModalBox', function () {
    return {
        templateUrl: 'modal/modal-box.html',
        transclude: true,
        scope: {
            close: '&',
            shown: '='
        }
    }
});