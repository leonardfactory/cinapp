angular
    .module('lfExtensions', [])
    .factory('ArrayExtend', function () 
    {
        if(typeof Array.prototype.remove === "undefined") {
           /**
            * Thanks to: http://stackoverflow.com/questions/5767325/remove-specific-element-from-an-array
            */
           Object.defineProperty(Array.prototype, "remove", {
               enumerable: false,
               value: function (item) {
                   var removeCounter = 0;

                   for (var index = 0; index < this.length; index++) {
                       if (this[index] === item) {
                           this.splice(index, 1);
                           removeCounter++;
                           index--;
                       }
                   }
                   return removeCounter;
               }
           });
        }
        
        return Array;
    });