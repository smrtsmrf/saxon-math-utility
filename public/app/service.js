(function() {
    'use strict';

    angular
        .module('saxonApp')
        .service('mainService', mainService);

    mainService.$inject = ['$http', '$q'];

    function mainService($http, $q) {

        var serviceFns = {

            // app.js
            isAuthed: function() {
                var deferred = $q.defer();
                return $http.get('/api/isAuthed').then(function(auth) {
                    var type = auth.data;
                    if (!type) {
                        deferred.reject('Not Logged In')
                    } else if (type == 'student') {
                        deferred.reject('Not Authorized')
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise;
                })
            },

            // app.js
            isLoggedIn: function() {
                var deferred = $q.defer();
                return $http.get('/api/isAuthed').then(function(auth) {
                    var type = auth.data;
                    if (!type) {
                        deferred.reject('Not Logged In')
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise;
                })
            },

            // signup, modify, admin
            findUsers: function(query) {
                return $http.get('api/users'+query).then(function(response) {
                    return response.data;
                })
            },

            // signup, admin
            createSchoolAndUsers: function(user) {
                return $http.post('/api/schools', user).then(function(result) {
                    return {
                        msg: result.data.msg,
                        flag: result.data.flag
                    }
                })
            },

            // modify, hw, admin
            retrieveSession: function() {
                return $http.get('/api/session').then(function(resp) {
                    return resp.data.user;
                })
            },

            // modify, hw, admin
            logout: function() {
                return $http.get('/api/logout')
            },

            // login, modify, hw, admin
            allSkippedData: null,
            getAllHW: function(school_id) {
                return $http.get('/api/schools/' + school_id + '/allHW').then(function(results) {
                    serviceFns.allSkippedData = results.data;
                    return serviceFns.allSkippedData;
                })
            },

        }
        return serviceFns;
    }
})();