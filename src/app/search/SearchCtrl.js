angular
    .module('cinApp')
    .controller('SearchCtrl', function (tmdbService) 
    {
        var _this = this;
        
        this.query = '';
        this.queryError = false;
        
        this.results = [];
        
        this.search = function () 
        {
            if(_this.query !== '') 
            {
                _this.queryError = false;
                tmdbService.api
                    .search.getMovie({ query: _this.query })
                    .then(function (data) 
                    {
                        console.log('Typeof data: ' + typeof data)
                        console.log(data);
                        _this.results = data.results;
                    });
            }
            else
            {
                _this.queryError = true;
            }
        }
    });