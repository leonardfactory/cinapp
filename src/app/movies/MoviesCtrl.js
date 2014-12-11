angular
    .module('cinApp')
    .controller('MoviesCtrl', ['$scope', function ($scope) 
    {
        var _this = this;
        
        this.inlineMovie = {};
        
        this.movies = [
            { name: 'Big Hero 6' },
            { name: 'Magic in the moonlight' }
        ];
    }]);