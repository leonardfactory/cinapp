angular
    .module 'lfEffects', ['ngAnimate']
    .service 'lfAnimator', ($timeout, $animate) ->
        ###
         * Apply an effect using a css animation class.
         * In case a timeout is passed, we will use a deferred
         * implementation instead of the the $animate service.
        ###
        applyEffect: (element, animationClass, timeout) ->
            if timeout?
                $timeout( ->
                    element.addClass animationClass
                , 0)
                
                $timeout( ->
                    element.removeClass animationClass
                , timeout);
            
            else 
                $animate.addClass element, animationClass
                    .then ->
                        element.removeClass animationClass