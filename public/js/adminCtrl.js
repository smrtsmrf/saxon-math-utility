(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('adminCtrl', adminCtrl);

    adminCtrl.$inject = ['$scope', '$rootScope', 'mainService', '$state'];

    function adminCtrl($scope, $rootScope, mainService, $state) {
        $scope.saving = false;

        if (!$rootScope.user) {
            mainService.retrieveSession().then(function(user) {
                $rootScope.user = user;
                mainService.getAllHW($rootScope.user.school_id).then(function(response) {
                    $rootScope.algSkipped = response.algSkipped;
                    $rootScope.geoSkipped = response.geoSkipped;
                    $rootScope.alg2Skipped = response.alg2Skipped;
                    mainService.findUsers('?school_id=' + $rootScope.user.school_id).then(function(data) {
                        $scope.users = data;
                    });
                })
            })
        } else {
            mainService.findUsers('?school_id=' + $rootScope.user.school_id).then(function(data) {
                $scope.users = data;
            });
        }

        $scope.signup = function(students) {
            $scope.saving = true;
            students.school = {
                name: $rootScope.user.school_name,
                city: $rootScope.user.school_city,
                state: $rootScope.user.school_state
            }
            var usernames = [];
            for (var key in students.users) {
                students.users[key].type = 'student';
                usernames.push(students.users[key].username)
            }

            mainService.findUsers('?username=' + usernames[0]).then(function(user) {
                if (user[0].available === false) {
                    alertify.error('Username ' + usernames[0] + ' not available', 5);
                } else {
                    mainService.findUsers('?username=' + usernames[1]).then(function(user) {
                        if (user[0].available === false) {
                            alertify.error('Username ' + usernames[1] + ' not available', 5);
                        } else {
                            mainService.findUsers('?username=' + usernames[2]).then(function(user) {
                                if (user[0].available === false) {
                                    alertify.error('Username ' + usernames[2] + ' not available', 5);
                                } else {
                                    mainService.createSchoolAndUsers(students).then(function(data) {
                                        mainService.findUsers('?school_id=' + $rootScope.user.school_id).then(function(users) {
                                            $scope.saving = false;
                                            $scope.users = users;
                                        })
                                        alertify.notify(data.msg, 'success', 5);
                                    });
                                }
                            })
                        }
                    })
                }
            })
            $scope.students = {};
        }

        $scope.delete = function(username) {
            mainService.deleteUser(username).then(function(users) {
                $scope.users = users;
            })
        };

        $scope.reset = function() {
            mainService.resetAllHW($rootScope.user.school_id).then(function() {
                $state.reload('alghw');
                $state.reload('geohw');
                $state.reload('alg2hw');
                $rootScope.algSkipped = [];
                $rootScope.geoSkipped = [];
                $rootScope.alg2Skipped = [];
            });
        }

        $scope.logout = function() {
            mainService.logout()
            $rootScope.user = {};
        }
    }
})();