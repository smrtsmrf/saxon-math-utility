(function() {
    'use strict';

    angular
        .module('saxonApp')
        .service('mainService', mainService);

    mainService.$inject = ['$http', '$q', '$cookies'];

    function mainService($http, $q, $cookies) {
        var user='';
        var lessonButtons = [];
        for (var i = 1; i <= 120; i++) {
            lessonButtons.push(i)
        };
        for (var i = 1; i <= 12; i++) {
            lessonButtons.push('INV'+i)
        };

        var serviceFns = {

            // setCookieData: function(user) {
            //     user = 'testing';
            //     $cookies.put('user', user)
            // },

            // getCookieData: function() {
            //     user = $cookies.get('user');
            //     return user;
            // },

            // clearCookieData: function() {
            //     // user = {};
            //     user='';
            //     $cookies.remove('user');
            // },

            lessons: lessonButtons,

            findUsers: function(query) {
                return $http.get('api/users'+query).then(function(response) {
                    // console.log(response);
                    return response.data;
                })
            },

            createSchoolAndUsers: function(user) {
                return $http.post('/api/schools', user).then(function(result) {
                    return result;
                })
            },

            login: function(user) {
                return $http.post('/api/login', user).then(function(response) {
                    // console.log(response.data);
                    return response.data;
                });
            },

            retrieveSession: function() {
                return $http.get('/api/session').then(function(resp) {
                    return resp.data.user;
                })
            },

            logout: function() {
                return $http.get('/api/logout')
            },

            isAuthed: function() {
                var deferred = $q.defer();
                return $http.get('/api/isAuthed').then(function(auth) {
                    var type = auth.data;
                    if (!type) {
                        deferred.reject('Not Logged In')
                    } else if (type !== 'admin') {
                        deferred.reject('Not Authorized')
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise;
                })
            },

            isLoggedIn: 
            function() {
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

            allSkippedData: null,
            getAllHW: function(school_id) {
                return $http.get('/api/schools/' + school_id + '/allHW').then(function(results) {
                    serviceFns.allSkippedData = results.data;
                    return serviceFns.allSkippedData;
                })
            },

            storeSkipped: function(subject, skippedLessons, school_id) {
                return $http.put('/api/schools/' + school_id + '/' + subject + '/skipped', {
                    skipped: skippedLessons
                }).then(function() {
                    return serviceFns.getAllHW(school_id);
                })
            }, 

            deleteUser: function(username) {
                return $http.delete('/api/users/'+username).then(function(response) {
                    var user = response.data
                    return serviceFns.findUsers('?school_id='+user.school_id)
                })
            }, 

            resetAllHW: function(school_id) {
                var reset = {
                    algSkipped: [], geoSkipped: [], alg2Skipped: []
                    };
                return $http.put('/api/schools/'+school_id+'/reset', reset).then(function() {
                    return serviceFns.getAllHW(school_id);
                })
            }
        }
        return serviceFns;
    }
})();