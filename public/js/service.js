(function() {
    'use strict';

    angular
        .module('saxonApp')
        .service('mainService', mainService);

    mainService.$inject = ['$http'];

    function mainService($http) {
        
        var lessonButtons = []
        for (var i = 1; i <= 120; i++) {
            lessonButtons.push(i)
        };

        var serviceFns = {

            lessons: lessonButtons,

            // userAvailable: function(username) {
            //     return $http.get('api/users?username=' + username).then(function(response) {
            //         // console.log(response);
            //         return response.data;
            //     })
            // },

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

            logout: function() {
                return $http.get('/api/logout')
            },

            allSkippedData: null,

            getAllHW: function(school_id) {
                return $http.get('/api/schools/' + school_id + '/allHW').then(function(results) {
                    // console.log(results);
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

                // return $http.put('/api/schools/' + school_id + '/alg/skipped', {skipped: []}).then(function() {
                //     return $http.put('/api/schools/' + school_id + '/geo/skipped', {skipped: []}).then(function() {
                //         return $http.put('/api/schools/' + school_id + '/alg2/skipped', {skipped: []})
                //     }).then(function() {
                //         return serviceFns.getAllHW(school_id);
                //     })
                // })

                // serviceFns.storeSkipped('alg', [], school_id);
                // serviceFns.storeSkipped('geo', [], school_id);
                // serviceFns.storeSkipped('alg2', [], school_id);
            }

        }
        return serviceFns;
    }
})();