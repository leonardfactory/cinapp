angular
    .module 'lfSlider', []
    .directive 'lfSlider', ($document, $timeout) ->
        template: """
            <div class="lf-slider">
                <div class="lf-slider-bar"></div
            </div>
        """
        restrict: 'E'
        replace: true
        scope:
            knobs: '='
            showConnectBar: '@'
        link: (scope, containerElement, attrs) ->
            
            # Inside bar
            element = containerElement.children()
            
            handles = []
            connectBar = null
            
            # Update positions
            updateModel = (i, value) ->
                handle = handles[i]
                scope.knobs[i] = value
                
                handle.css
                    left: value + '%'
                    
            # Update connect bar
            scope.$watch 'showConnectBar', (show) ->
                console.log show
                if show
                    connectBar = angular.element '<div class="lf-slider-connect-bar"></div>'
                    element.append connectBar
                    updateConnectBar()
                    
            updateConnectBar = () ->
                firstKnob = scope.knobs[0]
                secondKnob = scope.knobs[1]
                connectBar.css
                    left: firstKnob + '%'
                    width: Math.round(secondKnob - firstKnob) + '%'
                    
            # Compute binding
            applyBinding = (property, i) ->
                handle = angular.element '<div class="lf-slider-handle"></div>'
                handles.push handle
                element.append handle
                
                # Handle mousedown
                handle.on 'mousedown', (evt) ->
                    
                    evt.preventDefault()
                    
                    # Which knob?
                    isFirst = i == 0
                    isLast = i == scope.knobs.length - 1
                    previous    = scope.knobs[i-1] if not isFirst
                    next        = scope.knobs[i+1] if not isLast
                    
                    # Save start position
                    originalRect = element[0].getBoundingClientRect()
                    handleRect   = handle[0].getBoundingClientRect()
                    originalX    = originalRect.left  #+ (evt.clientX - handleRect.left)
                    
                    mousemove = (evt) => 
                        diff = evt.clientX - originalX
                        value = diff / element.prop('clientWidth') * 100 # fix
                        
                        unless (value < 0 or value > 100) or (not isLast and value > next) or (not isFirst and value < previous) 
                            updateModel i, value
                            updateConnectBar() if connectBar? 
                        
                    mouseup = (evt) ->
                        console.log scope.knobs
                        $document.unbind 'mousemove', mousemove
                        $document.unbind 'mouseup', mouseup
                           
                           
                    $document.on 'mousemove', mousemove
                    $document.on 'mouseup', mouseup
            
            # Start listening
            scope.$watch 'knobs', (knobs) ->
                for property, i in knobs
                    applyBinding property, i
                    updateModel i, knobs[i]
                updateConnectBar()
                    