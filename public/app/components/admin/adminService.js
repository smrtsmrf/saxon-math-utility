(function() {
    'use strict';

    angular
        .module('saxonApp')
        .service('adminService', adminService);

    adminService.$inject = ['$http', 'mainService'];

    function adminService($http, mainService) {
        this.resetAllHW = function(school_id) {
            var reset = {
                algSkipped: [],
                geoSkipped: [],
                alg2Skipped: []
            };
            return $http.put('/api/schools/' + school_id + '/reset', reset).then(function() {
                return mainService.getAllHW(school_id);
            })
        }

        this.deleteUser = function(username) {
            return $http.delete('/api/users/' + username).then(function(response) {
                var user = response.data
                return mainService.findUsers('?school_id=' + user.school_id);
            })
        }
    }
})();