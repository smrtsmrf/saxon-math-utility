(function() {
    'use strict';

    angular
        .module('saxonApp')
        .service('mainService', mainService);

    mainService.$inject = ['$http'];

    function mainService($http) {

        this.createSchoolAndUsers = function(user) {
            return $http.post('/api/schools', user).then(function(result) {
                return result;
            })
        }

        this.login = function(user) {
            return $http.post('/api/login', user).then(function(response) {
                console.log(response);
                return response.data;
            });
        }

        this.updateAndGetHW = function(skippedLessons, school_id, sub) {
            return $http.put('/api/schools/' + school_id + '/' + sub + '?lessonRef=' + JSON.stringify(skippedLessons)).then(function(results) {
                console.log(results);
                return results.data;
            })
        }

    }
})();