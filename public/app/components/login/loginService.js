(function() {
    'use strict';

    angular
        .module('saxonApp')
        .service('loginService', loginService);

    loginService.$inject = ['$http'];

    function loginService($http) {
        this.login = function(user) {
            return $http.post('/api/login', user).then(function(response) {
                return response.data;
            });
        }

        this.removeOldKeys = function(school_id, today) {
            return $http.delete('/api/schools/' + school_id + '/removeOldKeys/' + encodeURI(today))
        }

    }
})();