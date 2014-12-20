angular
    .module('cinApp')
    .service('loaderService', function () 
    {
        return {
            loading: false,
            counter: 0,
            start: function () {
                this.counter++;
                this.loading = true;
            },
            done: function () {
                this.counter--;
                if(this.counter === 0) {
                    this.loading = false;   
                }
            }
        }
    });