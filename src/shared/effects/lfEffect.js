angular
    .module('lfEffects', ['ngAnimate'])
    .service('lfAnimator', function ($timeout, $animate) 
    {
        return {
            /**
             * Apply an effect using a css animation class.
             * In case a timeout is passed, we will use a deferred
             * implementation instead of the the $animate service.
             */
            applyEffect: function (element, animationClass, timeout) {
                if(!angular.isUndefined(timeout)) {
                    
                    $timeout(function () {
                        element.addClass(animationClass);
                    }, 0);
                    
                    return $timeout(function () {
                            element.removeClass(animationClass);
                        }, timeout);
                }
                else {
                    return $animate.addClass(element, animationClass)
                        .then(function () {
                            element.removeClass(animationClass);
                        });
                }
            }
        }
    })
    .directive('lfShakeError', function ($timeout, lfAnimator) 
    {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.lfShakeError, function (error) {
                    if(error) {
                        lfAnimator.applyEffect(element, 'lf-effect-shake');
                    }
                });
            }
        }
    })
    