(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('adminCtrl', adminCtrl);

    adminCtrl.$inject = ['$scope', '$rootScope', 'mainService', '$state', 'adminService'];

    function adminCtrl($scope, $rootScope, mainService, $state, adminService) {

           $scope.students = {
            users: {
                alg: {},
                geo: {},
                alg2: {},
            }
        }

        $scope.resetting = false;

        function resetLinks() {
            $scope.usersLink = false;
            $scope.createLink = false;
            $scope.resetLink = false;
            $scope.instructions = false;
            $scope.usersLinkActive = false;
            $scope.createLinkActive = false;
            $scope.resetLinkActive = false;
            $scope.instructionsActive = false;
        }

        $scope.showDetails = function(str) {
            resetLinks();
            $scope[str] = true;
            $scope[str+'Active'] = true;
        }

        $scope.saving = false;

        function setGridOptions(data) {
            $scope.gridOptions = {
                enableColumnResize: true,
                data: data,
                enableSorting: true,
                sortInfo: {
                    fields: ['type'],
                    directions: ['asc']
                },
                rowHeight: 35,
                columnDefs: [{
                    field: 'username',
                    displayName: 'User',
                    width: '*'
                }, {
                    field: 'type',
                    displayName: 'Role',
                    width: '*'
                }, {
                    field: 'username',
                    displayName: 'Delete',
                    cellTemplate: '<button ng-click="delete(row.getProperty(col.field))" class="btn btn-danger delete"><i class="fa fa-times-circle" aria-hidden="true"></i></button>',
                    width: '*'
                }, ]
            }
        }

        if (!$rootScope.user) {
            mainService.retrieveSession().then(function(user) {
                $rootScope.user = user;
                mainService.getAllHW($rootScope.user.school_id).then(function(response) {
                    $rootScope.algSkipped = response.algSkipped;
                    $rootScope.geoSkipped = response.geoSkipped;
                    $rootScope.alg2Skipped = response.alg2Skipped;
                    mainService.findUsers('?school_id=' + $rootScope.user.school_id).then(function(data) {
                        $scope.users = data;
                        setGridOptions('users');
                        $scope.instructions = true;
                        $scope.instructionsActive = true;
                    });
                })
            })
        } else {
            mainService.findUsers('?school_id=' + $rootScope.user.school_id).then(function(data) {
                $scope.users = data;
                setGridOptions('users');
                $scope.instructions = true;
                $scope.instructionsActive = true;
            });
        }

        $scope.signup = function(students) {
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
                                    $scope.saving = true;
                                    mainService.createSchoolAndUsers(students).then(function(data) {
                                        mainService.findUsers('?school_id=' + $rootScope.user.school_id).then(function(users) {
                                            $scope.saving = false;
                                            $scope.users = users;
                                            setGridOptions('users');
                                        })
                                        alertify.notify(data.msg, 'success', 5);
                                        $scope.showDetails('usersLink')
                                    });
                                }
                            })
                        }
                    })
                }
                $scope.students = {};
            })
        }

        $scope.delete = function(username) {
            var msg = 'Are you sure you want to delete ' + username + '?'
            alertify.confirm('Delete User', msg, function() {
                adminService.deleteUser(username).then(function(users) {
                    $scope.users = users;
                    setGridOptions('users');
                })
            }, function() {})

        };

        $scope.reset = function() {
            $scope.resetting = true;
            adminService.resetAllHW($rootScope.user.school_id).then(function() {
                $state.reload('hw', {subject: 'alg'});
                $state.reload('hw', {subject: 'geo'});
                $state.reload('hw', {subject: 'alg2'});
                $rootScope.algSkipped = [];
                $rootScope.geoSkipped = [];
                $rootScope.alg2Skipped = [];
                $scope.resetting = false;
                alertify.alert('Homework reset successfully', function() {})
            });
        }

        $scope.logout = function() {
            mainService.logout()
            $rootScope.user = {};
        }
    }
})();