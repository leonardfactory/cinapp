angular
    .module('cinApp')
    .factory('parseService', function () 
    {
        return {
            init: function () {
                // Our connection to parse.com.
                Parse.initialize("iWpIHpzgt0smKYu82KpebMVwoWtNIHNPb1NpAKU9", "Z5qq7rp54YLvw9RGpt5X3jKJ7WLwurx3UzOBJVuY");
            }
        }
    });