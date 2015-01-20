angular
    .module 'angular-modal', ['shared-templates', 'lfEffects']
    .factory 'angularModal', ($q, $templateCache, $document, $rootScope, $compile, $controller, $timeout, lfAnimator) ->
        angularModal =
            show: (options) =>
                modalResultDefer   = $q.defer()
                modalOpenDefer     = $q.defer()
                
                # Check options
                unless options.templateUrl?
                    throw new Error "No template URL specified for modal dialog."
                
                # Define scope
                modalScope = (options.scope or $rootScope).$new()
                
                # Compute element from template and insert it in the DOM
                body                = $document.find 'body'
                elementTemplate     = angular.element $templateCache.get options.templateUrl
                element             = $compile(elementTemplate)(modalScope) # Link to modal scope
                body.append element
        
                containerElement    = element.find '.modal-container'
                
                # Body should not be scrollable when modal is opened
                body.addClass 'noscroll'
                
                # `Esc` binding
                escBinding = (evt) ->
                    if evt.which is 27
                        evt.preventDefault()
                        modalScope.$close no
                    
                $document.bind 'keydown', escBinding
                
                # Create modal window
                modalWindow =
                    result: modalResultDefer.promise
                    opened: modalOpenDefer.promise
            
                    # Animations
                    effect: (effectName) -> lfAnimator.applyEffect element, 'modal-animation-' + effectName, 400 # ms 
                    shake: -> @effect 'shake'
                    successed: -> @effect 'successed'
                    
                # Controller
                if options.controller?
                    locals =
                        $scope: modalScope
                        $modalWindow: modalWindow
            
                    if options.locals?
                        locals[key] = value for own key, value of options.locals
            
                    ctrl = $controller options.controller, locals
                    modalScope[options.controllerAs] = ctrl if options.controllerAs?
                    
                # Close utility
                modalScope.$close = (result, params) ->
                    modalWindow.effect 'leaving'
            
                    modalResultDefer.resolve result: result, params: params
            
                    delay = options.closeDelay or 400;
                    $timeout( ->
                        # Unbind keydown
                        $document.unbind 'keydown', escBinding
                
                        # Allow body to scroll again
                        body.removeClass 'noscroll'
                
                        # Remove scope & DOM element
                        modalScope.$destroy()
                        element.remove()
                    , delay)
                    
                # Show
                modalScope.shown = yes
        
                #  Start show effect
                modalWindow.effect 'shown'
        
                modalWindow
         
    # Directive to make easier the creation of a modal box.
    #       
    .directive 'ngModalBox', ($timeout) ->
        templateUrl: 'modal/modal-box.html'
        transclude: true
        replace: true
        
    # Directive to detect click outside element
    #
    .directive 'ngModalClickOutside', ($document, $timeout, $parse) ->
        restrict: 'A'
        compile: ($element, attrs) ->
            
            clickFn = $parse(attrs.ngModalClickOutside)
            
            # Return post-link function
            (scope, element, attrs) ->
            
                documentClick = (event) ->
                    # Check if we clicked inside element
                    inside = event.target is element[0] or element[0].contains(event.target) > 0
                    # Then run passed function
                    if not inside
                        clickFn scope
                
                # Defer in order to not catch click that opened the modal
                $timeout( -> 
                    $document.bind 'click', documentClick
                , 0)
            
                scope.$on '$destroy', -> 
                    $document.unbind 'click', documentClick
        