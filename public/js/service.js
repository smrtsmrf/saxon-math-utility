(function() {
    'use strict';

    angular
        .module('saxonApp')
        .service('mainService', mainService);

    mainService.$inject = ['$http', '$state'];

    function mainService($http, $state) {


        var myFunctions = {

            userAvailable: function(username) {
            return $http.get('api/users?username=' + username).then(function(response) {
                console.log(response);
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
                console.log(response.data);
                return response.data;
            });
        },

        allSkippedData: null,
        // function getHW(school_id) {
        getAllHW: function(school_id) {

            return $http.get('/api/schools/' + school_id + '/allHW').then(function(results) {
                console.log(results);
                myFunctions.allSkippedData = results.data;
                // console.log('algskippeddata', algSkippedData);
                return myFunctions.allSkippedData;
            })
        },

        // returnData: function() {
        //     console.log('inside fn allskippeddata', myFunctions.allSkippedData);
        //     return myFunctions.allSkippedData;
        // },   

        storeSkipped: function(subject, skippedLessons, school_id) {
            console.log('subject', subject);
            console.log('skippedLessons', skippedLessons);
            console.log('school_id', school_id);
            return $http.put('/api/schools/' + school_id + '/' + subject + '/skipped', {
                skipped: skippedLessons
            }).then(function() {
                return myFunctions.getAllHW(school_id);
            })
        }

        }
        return myFunctions;


        // -----------------------------------------------------

        

// ----------------------
// this.userAvailable = function(username) {
//             return $http.get('api/users?username=' + username).then(function(response) {
//                 console.log(response);
//                 return response.data;
//             })
//         }

//         this.createSchoolAndUsers = function(user) {
//             return $http.post('/api/schools', user).then(function(result) {
//                 return result;
//             })
//         }

//         this.login = function(user) {
//             return $http.post('/api/login', user).then(function(response) {
//                 console.log(response.data);
//                 return response.data;
//             });
//         }

//         var allSkippedData;
//         // function getHW(school_id) {
//         this.getAllHW = function(school_id) {

//             return $http.get('/api/schools/' + school_id + '/allHW').then(function(results) {
//                 console.log(results);
//                 allSkippedData = results.data;
//                 // console.log('algskippeddata', algSkippedData);
//                 return allSkippedData;
//             })
//         }

//         this.returnData = function() {
//             console.log('inside fn allskippeddata', allSkippedData);
//             return allSkippedData;
//         }   

//         this.storeSkipped = function(subject, skippedLessons, school_id) {
//             return $http.put('/api/schools/' + school_id + '/' + subject + '/skipped', {
//                 skipped: skippedLessons
//             }).then(function() {
//                 getHW(school_id);
//             })
//         }









// -----------------------

        //  this.getSkipped = function(subject, school_id) {
        //     return $http.get('/api/schools/' + school_id + '/' + subject + '/skipped').then(function() {
        //         getHW(school_id);
        //     })
        // }
        // 
        //      // this.storeSkipped = function(subject, skippedLessons, school_id) {
        //     return $http.put('/api/schools/' + school_id + '/' + subject + '/skipped', {skipped: skippedLessons}).then(function (result) {
        //         updateAndGetHW(result, school_id)
        //     })
        // }

        // this.getUser = function(username) {

        // }
        // 
        //   // this.getSkipped = function(subject, school_id) {
        //     return $http.get('/api/schools/' + school_id + '/' + subject + '/skipped').then(function(response) {
        //         console.log(response);
        //         return response.data;
        //     })
        // }

        // this.updateAndGetHW = function(skippedLessons, school_id, subject) {
            // return $http.put('/api/schools/' + school_id + '/' + subject + '?lessonRef=' + JSON.stringify(skippedLessons)).then(function(results) {
        //         return results.data;
        //     })
        // }

    }
})();