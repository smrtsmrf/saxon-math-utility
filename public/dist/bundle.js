'use strict';

(function () {
    'use strict';

    angular.module('saxonApp', ['ui.router', 'ngGrid']);
})();

(function () {
    'use strict';

    angular.module('saxonApp').run(function ($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams, error) {
            $rootScope.requested = {
                url: toState.name,
                subject: toParams.subject
            };
            console.log($rootScope.requested);
            if (error == "Not Authorized") {
                console.log('not authorized');
                $state.go($state.current.name);
            } else if (error == "Not Logged In") {
                console.log('not logged in');
                $state.go('login');
            }
        });
    });
})();

(function () {
    'use strict';

    angular.module('saxonApp').config(saxonAppConfig);

    saxonAppConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function saxonAppConfig($stateProvider, $urlRouterProvider) {
        $stateProvider.state('login', {
            url: '/',
            templateUrl: '/app/components/login/login.html',
            controller: 'loginCtrl'
        }).state('signup', {
            url: '/signup',
            templateUrl: '/app/components/signup/signup.html',
            controller: 'signupCtrl'
        }).state('modify', {
            url: '/:subject/modify',
            templateUrl: '/app/components/modify/modify.html',
            controller: 'modifyCtrl',
            resolve: {
                security: ['mainService', function (mainService) {
                    return mainService.isAuthed();
                }]
            }
        }).state('hw', {
            url: '/:subject/hw',
            templateUrl: '/app/components/hw/hw.html',
            controller: 'hwCtrl',
            resolve: {
                security: ['mainService', function (mainService) {
                    return mainService.isLoggedIn();
                }]
            }
        }).state('admin', {
            url: '/admin',
            templateUrl: '/app/components/admin/admin.html',
            controller: 'adminCtrl',
            resolve: {
                security: ['mainService', function (mainService) {
                    return mainService.isAuthed();
                }]
            }
        });

        $urlRouterProvider.otherwise('/');
    }
})();
(function () {

    'use strict';

    angular.module('saxonApp').filter('orderObjectBy', orderObjectByFilter);

    function orderObjectByFilter() {
        return function (items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function (item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return a[field] > b[field] ? 1 : -1;
            });
            if (reverse) filtered.reverse();
            return filtered;
        };
    }
})();
(function () {
    'use strict';

    angular.module('saxonApp').service('mainService', mainService);

    mainService.$inject = ['$http', '$q'];

    function mainService($http, $q) {

        var serviceFns = {

            // app.js
            isAuthed: function isAuthed() {
                var deferred = $q.defer();
                return $http.get('/api/isAuthed').then(function (auth) {
                    var type = auth.data;
                    if (!type) {
                        deferred.reject('Not Logged In');
                    } else if (type == 'student') {
                        deferred.reject('Not Authorized');
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise;
                });
            },

            // app.js
            isLoggedIn: function isLoggedIn() {
                var deferred = $q.defer();
                return $http.get('/api/isAuthed').then(function (auth) {
                    var type = auth.data;
                    if (!type) {
                        deferred.reject('Not Logged In');
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise;
                });
            },

            // signup, modify, admin
            findUsers: function findUsers(query) {
                return $http.get('api/users' + query).then(function (response) {
                    return response.data;
                });
            },

            // signup, admin
            createSchoolAndUsers: function createSchoolAndUsers(user) {
                return $http.post('/api/schools', user).then(function (result) {
                    return {
                        msg: result.data.msg,
                        flag: result.data.flag
                    };
                });
            },

            // modify, hw, admin
            retrieveSession: function retrieveSession() {
                return $http.get('/api/session').then(function (resp) {
                    return resp.data.user;
                });
            },

            // modify, hw, admin
            logout: function logout() {
                return $http.get('/api/logout');
            },

            // login, modify, hw, admin
            allSkippedData: null,
            getAllHW: function getAllHW(school_id) {
                return $http.get('/api/schools/' + school_id + '/allHW').then(function (results) {
                    serviceFns.allSkippedData = results.data;
                    return serviceFns.allSkippedData;
                });
            }

        };
        return serviceFns;
    }
})();
(function () {
    'use strict';

    angular.module('saxonApp').controller('adminCtrl', adminCtrl);

    adminCtrl.$inject = ['$scope', '$rootScope', 'mainService', '$state', 'adminService'];

    function adminCtrl($scope, $rootScope, mainService, $state, adminService) {

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

        $scope.showDetails = function (str) {
            resetLinks();
            $scope[str] = true;
            $scope[str + 'Active'] = true;
        };

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
                }]
            };
        }

        if (!$rootScope.user) {
            mainService.retrieveSession().then(function (user) {
                $rootScope.user = user;
                mainService.getAllHW($rootScope.user.school_id).then(function (response) {
                    $rootScope.algSkipped = response.algSkipped;
                    $rootScope.geoSkipped = response.geoSkipped;
                    $rootScope.alg2Skipped = response.alg2Skipped;
                    mainService.findUsers('?school_id=' + $rootScope.user.school_id).then(function (data) {
                        $scope.users = data;
                        setGridOptions('users');
                        $scope.instructions = true;
                        $scope.instructionsActive = true;
                    });
                });
            });
        } else {
            mainService.findUsers('?school_id=' + $rootScope.user.school_id).then(function (data) {
                $scope.users = data;
                setGridOptions('users');
                $scope.instructions = true;
                $scope.instructionsActive = true;
            });
        }

        $scope.signup = function (students) {
            students.school = {
                name: $rootScope.user.school_name,
                city: $rootScope.user.school_city,
                state: $rootScope.user.school_state
            };
            var usernames = [];
            for (var key in students.users) {
                students.users[key].type = 'student';
                usernames.push(students.users[key].username);
            }

            mainService.findUsers('?username=' + usernames[0]).then(function (user) {
                if (user[0].available === false) {
                    alertify.error('Username ' + usernames[0] + ' not available', 5);
                } else {
                    mainService.findUsers('?username=' + usernames[1]).then(function (user) {
                        if (user[0].available === false) {
                            alertify.error('Username ' + usernames[1] + ' not available', 5);
                        } else {
                            mainService.findUsers('?username=' + usernames[2]).then(function (user) {
                                if (user[0].available === false) {
                                    alertify.error('Username ' + usernames[2] + ' not available', 5);
                                } else {
                                    $scope.saving = true;
                                    mainService.createSchoolAndUsers(students).then(function (data) {
                                        mainService.findUsers('?school_id=' + $rootScope.user.school_id).then(function (users) {
                                            $scope.saving = false;
                                            $scope.users = users;
                                            setGridOptions('users');
                                        });
                                        alertify.notify(data.msg, 'success', 5);
                                        $scope.showDetails('usersLink');
                                    });
                                }
                            });
                        }
                    });
                }
            });
            $scope.students = {};
        };

        $scope.delete = function (username) {
            var msg = 'Are you sure you want to delete ' + username + '?';
            alertify.confirm('Delete User', msg, function () {
                // mainService.deleteUser(username).then(function(users) {
                adminService.deleteUser(username).then(function (users) {
                    $scope.users = users;
                    setGridOptions('users');
                });
            }, function () {});
        };

        $scope.reset = function () {
            $scope.resetting = true;
            // mainService.resetAllHW($rootScope.user.school_id).then(function() {
            adminService.resetAllHW($rootScope.user.school_id).then(function () {
                $state.reload('hw', { subject: 'alg' });
                $state.reload('hw', { subject: 'geo' });
                $state.reload('hw', { subject: 'alg2' });
                $rootScope.algSkipped = [];
                $rootScope.geoSkipped = [];
                $rootScope.alg2Skipped = [];
                $scope.resetting = false;
                alertify.alert('Homework reset successfully', function () {});
            });
        };

        $scope.logout = function () {
            mainService.logout();
            $rootScope.user = {};
        };
    }
})();
(function () {
    'use strict';

    angular.module('saxonApp').service('adminService', adminService);

    adminService.$inject = ['$http', 'mainService'];

    function adminService($http, mainService) {
        this.resetAllHW = function (school_id) {
            var reset = {
                algSkipped: [],
                geoSkipped: [],
                alg2Skipped: []
            };
            return $http.put('/api/schools/' + school_id + '/reset', reset).then(function () {
                return mainService.getAllHW(school_id);
            });
        };

        this.deleteUser = function (username) {
            return $http.delete('/api/users/' + username).then(function (response) {
                var user = response.data;
                return mainService.findUsers('?school_id=' + user.school_id);
            });
        };
    }
})();
(function () {
    'use strict';

    angular.module('saxonApp').controller('hwCtrl', hwCtrl);

    hwCtrl.$inject = ['$scope', '$rootScope', 'mainService', '$state', '$stateParams'];

    function hwCtrl($scope, $rootScope, mainService, $state, $stateParams) {

        $scope.subject = $stateParams.subject;
        var subject = $scope.subject;
        $scope.subjectTitle = subject == 'alg' ? 'Algebra' : subject == 'geo' ? 'Geometry' : 'Algebra II';

        if (!$rootScope.user) {
            mainService.retrieveSession().then(function (user) {
                $rootScope.user = user;
                mainService.getAllHW($rootScope.user.school_id).then(function (response) {
                    $rootScope.algSkipped = response.algSkipped;
                    $rootScope.geoSkipped = response.geoSkipped;
                    $rootScope.alg2Skipped = response.alg2Skipped;
                    populateData();
                });
            });
        } else {
            populateData();
        }

        function populateData() {
            var data = mainService.allSkippedData[subject];
            // var skipped = mainService.allSkippedData[subject+'Skipped'];
            $scope[subject + 'AssignedData'] = {};
            $scope[subject + 'SkippedData'] = {};

            var assignedData = $scope[subject + 'AssignedData'];
            var skippedData = $scope[subject + 'SkippedData'];

            for (var j = 1; j <= 120; j++) {
                if ($rootScope[subject + 'Skipped'].indexOf(j) == -1) {
                    assignedData[j] = {};
                    assignedData[j].lesson = j;
                    assignedData[j].problems = [];
                    skippedData[j] = {};
                    skippedData[j].lesson = j;
                    skippedData[j].problems = [];

                    for (var i = 0; i < data.length; i++) {
                        var problems = data[i];
                        var inSkipped = $rootScope[subject + 'Skipped'].indexOf(problems.lessonRef);
                        if (problems.lessonNum == j && inSkipped == -1) {
                            assignedData[j].problems.push(problems.problemNum);
                        } else if (problems.lessonNum == j && inSkipped > -1) {
                            skippedData[j].problems.push(problems.problemNum);
                        }
                    }

                    assignedData[j].problems = getRanges(assignedData[j].problems);
                    skippedData[j].problems = getRanges(skippedData[j].problems);
                };
            }

            $scope.assignedLessons = assignedData;
            $scope.skippedLessons = skippedData;
        }

        function getRanges(array) {
            array.sort(function (a, b) {
                return a - b;
            });
            var ranges = [],
                rstart,
                rend;
            for (var i = 0; i < array.length; i++) {
                rstart = array[i];
                rend = rstart;
                while (array[i + 1] - array[i] == 1) {
                    rend = array[i + 1]; // increment the index if the numbers sequential
                    i++;
                }
                ranges.push(rstart == rend ? rstart + '' : rstart + '-' + rend);
            }
            return ranges;
        }

        $scope.logout = function () {
            mainService.logout();
            $rootScope.user = {};
        };
    }
})();
(function () {
    'use strict';

    angular.module('saxonApp').controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$filter', '$state', 'mainService', '$rootScope', 'loginService'];

    function loginCtrl($scope, $filter, $state, mainService, $rootScope, loginService) {

        $scope.loading = false;

        $scope.login = function (user) {
            $scope.loading = true;
            // mainService.login(user).then(function(currUser) {
            loginService.login(user).then(function (currUser) {

                if (currUser.userFound !== false) {
                    $rootScope.user = currUser;
                    var username = currUser.username;

                    mainService.getAllHW($rootScope.user.school_id).then(function (response) {
                        $rootScope.algSkipped = response.algSkipped;
                        $rootScope.geoSkipped = response.geoSkipped;
                        $rootScope.alg2Skipped = response.alg2Skipped;
                        switch (true) {
                            case $rootScope.requested != undefined:
                                $state.go($rootScope.requested.url, { subject: $rootScope.requested.subject });
                                break;
                            case username.toLowerCase().includes('alg2'):
                                $state.go('hw', { subject: 'alg2' });
                                break;
                            case username.toLowerCase().includes('geo'):
                                $state.go('hw', { subject: 'geo' });
                                break;
                            case $rootScope.user.type == 'admin':
                                var today = new Date();
                                // mainService.removeOldKeys($rootScope.user.school_id, today)
                                loginService.removeOldKeys($rootScope.user.school_id, today);
                                $state.go('admin');
                                break;
                            default:
                                $state.go('hw', { subject: 'alg' });
                                break;
                        }
                    });
                } else {
                    alertify.error('Invalid username/password', 5);
                    $scope.loading = false;
                    $scope.user = {};
                }
            });
        };
    }
})();
(function () {
    'use strict';

    angular.module('saxonApp').service('loginService', loginService);

    loginService.$inject = ['$http'];

    function loginService($http) {
        this.login = function (user) {
            return $http.post('/api/login', user).then(function (response) {
                return response.data;
            });
        };

        this.removeOldKeys = function (school_id, today) {
            return $http.delete('/api/schools/' + school_id + '/removeOldKeys/' + encodeURI(today));
        };
    }
})();
(function () {
    'use strict';

    angular.module('saxonApp').controller('modifyCtrl', modifyCtrl);

    modifyCtrl.$inject = ['$scope', '$rootScope', '$state', 'mainService', '$stateParams', 'modifyService'];

    function modifyCtrl($scope, $rootScope, $state, mainService, $stateParams, modifyService) {
        if (!$rootScope.user) {
            mainService.retrieveSession().then(function (user) {
                $rootScope.user = user;
                mainService.getAllHW($rootScope.user.school_id).then(function (response) {
                    $rootScope.algSkipped = response.algSkipped;
                    $rootScope.geoSkipped = response.geoSkipped;
                    $rootScope.alg2Skipped = response.alg2Skipped;
                    populateData();
                });
            });
        }

        $scope.saving = false;

        $scope.showAdminKey = false;

        $scope.subject = $stateParams.subject;
        var subject = $scope.subject;

        $scope.subjectTitle = subject == 'alg' ? 'Algebra' : subject == 'geo' ? 'Geometry' : 'Algebra II';

        var original = mainService.allSkippedData[subject + 'Skipped'];

        revert();

        var unchanged;

        function setButtonText() {
            unchanged = original.length == $rootScope[subject + 'Skipped'].length && $rootScope[subject + 'Skipped'].every(function (el, idx) {
                return el == original[idx];
            });
            var update = $rootScope.user.type == 'admin' ? 'Update HW' : 'Request Update';
            $scope.buttonText = unchanged ? 'View HW' : update;
        }

        setButtonText();

        // $scope.lessons = mainService.lessons;
        $scope.lessons = modifyService.lessons;

        $scope.show = true;

        $scope.updateSkipped = function (lesson) {
            var idx = $rootScope[subject + 'Skipped'].indexOf(lesson);
            if (idx > -1) {
                $rootScope[subject + 'Skipped'].splice(idx, 1);
            } else {
                $rootScope[subject + 'Skipped'].push(lesson);
                $rootScope[subject + 'Skipped'].sort(function (a, b) {
                    return a - b;
                });
            }
            setButtonText();
        };

        $scope.storeSkipped = function () {
            if (unchanged) {
                $state.go('hw', { subject: subject });
            } else {
                $scope.saving = true;
                // mainService.storeSkipped(subject, $rootScope[subject+'Skipped'], $rootScope.user.school_id).then(function() {
                modifyService.storeSkipped(subject, $rootScope[subject + 'Skipped'], $rootScope.user.school_id).then(function () {
                    $state.go('hw', { subject: subject });
                });
            }
        };

        $scope.submitAdminKey = function (adminKey) {
            // mainService.submitAdminKey($rootScope.user.school_id, adminKey, subject).then(function(result) {
            modifyService.submitAdminKey($rootScope.user.school_id, adminKey, subject).then(function (result) {
                if (!result.failure) {
                    var shouldDo = JSON.parse("[" + result.shouldDo + "]");
                    var shouldSkip = JSON.parse("[" + result.shouldSkip + "]");
                    $rootScope[subject + 'Skipped'] = mainService.allSkippedData[subject + 'Skipped'];

                    shouldDo.forEach(function (element) {
                        var idx = $rootScope[subject + 'Skipped'].indexOf(element);
                        if (idx >= 0) {
                            $rootScope[subject + 'Skipped'].splice(idx, 1);
                        }
                    });

                    shouldSkip.forEach(function (element) {
                        var idx = $rootScope[subject + 'Skipped'].indexOf(element);
                        if (idx < 0) {
                            $rootScope[subject + 'Skipped'].push(element);
                        }
                    });

                    $rootScope[subject + 'Skipped'].sort(function (a, b) {
                        return a - b;
                    });

                    $scope.storeSkipped();

                    // mainService.deleteAdminKey($rootScope.user.school_id, adminKey)
                    modifyService.deleteAdminKey($rootScope.user.school_id, adminKey);
                } else {
                    alertify.error(result.failure, 5);
                }
            });
        };

        $scope.reset = function () {
            if ($rootScope.user.type == 'admin') {
                $rootScope[subject + 'Skipped'] = [];
            } else {
                revert();
            }
            setButtonText();
        };

        $scope.logout = function () {
            mainService.logout();
            $rootScope.user = {};
        };

        $scope.test = true;

        $scope.preReq = function () {
            $scope.shouldDo = original.filter(function (el, idx) {
                return $rootScope[subject + 'Skipped'].indexOf(el) == -1;
            });

            if ($scope.shouldDo == false) {
                $scope.doReason = 'null';
            }
            $scope.shouldSkip = $rootScope[subject + 'Skipped'].filter(function (el) {
                return original.indexOf(el) == -1;
            });

            if ($scope.shouldSkip == false) {
                $scope.skipReason = 'null';
            }
        };

        // need to handle errors
        $scope.requestUpdate = function () {
            if (!$scope.shouldDo) $scope.shouldDo = '';
            if (!$scope.shouldSkip) $scope.shouldSkip = '';
            if ($scope.shouldDo.length > 0 || $scope.shouldSkip.length > 0) {
                $scope.saving = true;
                mainService.findUsers('?school_id=' + $rootScope.user.school_id).then(function (users) {
                    var admin = users.filter(function (user) {
                        return user.type === 'admin';
                    })[0];

                    // mainService.requestUpdate($rootScope.user.school_id, $rootScope.user, admin.email, subject, $scope.shouldDo.toString(), $scope.doReason, $scope.shouldSkip.toString(), $scope.skipReason).then(function() {
                    modifyService.requestUpdate($rootScope.user.school_id, $rootScope.user, admin.email, subject, $scope.shouldDo.toString(), $scope.doReason, $scope.shouldSkip.toString(), $scope.skipReason).then(function () {
                        var msg = 'Your message was sent to ' + admin.email;
                        $state.go('hw', { subject: subject });
                        alertify.success(msg, 5, function () {});
                    });
                });
            } else {
                $state.go('hw', { subject: subject });
            }
        };

        function revert() {
            $rootScope[subject + 'Skipped'] = [];
            original.forEach(function (el) {
                $rootScope[subject + 'Skipped'].push(el);
            });
        }
        $scope.resetReason = function () {
            $scope.doReason = null;
            $scope.skipReason = null;
        };
    }
})();
(function () {
    'use strict';

    angular.module('saxonApp').service('modifyService', modifyService);

    modifyService.$inject = ['$http', 'mainService'];

    function modifyService($http, mainService) {
        var user = '';
        var lessonButtons = [];
        for (var i = 1; i <= 120; i++) {
            lessonButtons.push(i);
            if (i % 10 == 0) {
                lessonButtons.push('INV' + i / 10);
            };
        };

        this.lessons = lessonButtons;

        this.deleteAdminKey = function (school_id, adminKey) {
            return $http.delete('/api/schools/' + school_id + '/adminKeys/' + adminKey);
        };

        this.submitAdminKey = function (school_id, adminKey, subject) {
            return $http.get('/api/schools/' + school_id + '/' + subject + '/adminKeys/' + adminKey).then(function (response) {
                return response.data;
            });
        };

        this.requestUpdate = function (school_id, user, adminEmail, subject, shouldDo, doReason, shouldSkip, skipReason) {
            var subject = subject.charAt(0).toUpperCase() + subject.slice(1);
            var doReason = doReason == 'null' ? doReason = null : doReason;
            var skipReason = skipReason == 'null' ? skipReason = null : skipReason;
            return $http.post('/api/email', {
                school_id: school_id,
                user: user,
                adminEmail: adminEmail,
                subject: subject,
                shouldDo: shouldDo,
                doReason: doReason,
                shouldSkip: shouldSkip,
                skipReason: skipReason
            });
        };

        this.storeSkipped = function (subject, skippedLessons, school_id) {
            return $http.put('/api/schools/' + school_id + '/' + subject + '/skipped', {
                skipped: skippedLessons
            }).then(function (results) {
                mainService.allSkippedData[subject] = results.data[subject];
                mainService.allSkippedData[subject + 'Skipped'] = results.data[subject + 'Skipped'];
                return mainService.allSkippedData;
            });
        };
    }
})();
(function () {
    'use strict';

    angular.module('saxonApp').controller('signupCtrl', signupCtrl);

    signupCtrl.$inject = ['$scope', 'mainService', '$state'];

    function signupCtrl($scope, mainService, $state) {
        $scope.saving = false;

        $scope.signup = function (user) {
            var username = user.users.self.username;
            mainService.findUsers('?username=' + username).then(function (data) {
                if (data[0].available === false) {
                    alertify.error('Username not available', 5);
                } else {
                    $scope.saving = true;
                    mainService.createSchoolAndUsers(user).then(function (resp) {
                        $scope.saving = false;
                        alertify.alert('Status', resp.msg, function () {
                            if (!resp.flag) {
                                $state.go('login');
                            }
                        });
                    });
                }
            });
        };

        $scope.options = [{
            name: "AL",
            value: "Alabama"
        }, {
            name: "AK",
            value: "Alaska"
        }, {
            name: "AZ",
            value: "Arizona"
        }, {
            name: "AR",
            value: "Arkansas"
        }, {
            name: "CA",
            value: "California"
        }, {
            name: "CO",
            value: "Colorado"
        }, {
            name: "CT",
            value: "Connecticut"
        }, {
            name: "DE",
            value: "Delaware"
        }, {
            name: "DC",
            value: "District Of Columbia"
        }, {
            name: "FL",
            value: "Florida"
        }, {
            name: "GA",
            value: "Georgia"
        }, {
            name: "HI",
            value: "Hawaii"
        }, {
            name: "ID",
            value: "Idaho"
        }, {
            name: "IL",
            value: "Illinois"
        }, {
            name: "IN",
            value: "Indiana"
        }, {
            name: "IA",
            value: "Iowa"
        }, {
            name: "KS",
            value: "Kansas"
        }, {
            name: "KY",
            value: "Kentucky"
        }, {
            name: "LA",
            value: "Louisiana"
        }, {
            name: "ME",
            value: "Maine"
        }, {
            name: "MD",
            value: "Maryland"
        }, {
            name: "MA",
            value: "Massachusetts"
        }, {
            name: "MI",
            value: "Michigan"
        }, {
            name: "MN",
            value: "Minnesota"
        }, {
            name: "MS",
            value: "Mississippi"
        }, {
            name: "MO",
            value: "Missouri"
        }, {
            name: "MT",
            value: "Montana"
        }, {
            name: "NE",
            value: "Nebraska"
        }, {
            name: "NV",
            value: "Nevada"
        }, {
            name: "NH",
            value: "New Hampshire"
        }, {
            name: "NJ",
            value: "New Jersey"
        }, {
            name: "NM",
            value: "New Mexico"
        }, {
            name: "NY",
            value: "New York"
        }, {
            name: "NC",
            value: "North Carolina"
        }, {
            name: "ND",
            value: "North Dakota"
        }, {
            name: "OH",
            value: "Ohio"
        }, {
            name: "OK",
            value: "Oklahoma"
        }, {
            name: "OR",
            value: "Oregon"
        }, {
            name: "PA",
            value: "Pennsylvania"
        }, {
            name: "RI",
            value: "Rhode Island"
        }, {
            name: "SC",
            value: "South Carolina"
        }, {
            name: "SD",
            value: "South Dakota"
        }, {
            name: "TN",
            value: "Tennessee"
        }, {
            name: "TX",
            value: "Texas"
        }, {
            name: "UT",
            value: "Utah"
        }, {
            name: "VT",
            value: "Vermont"
        }, {
            name: "VA",
            value: "Virginia"
        }, {
            name: "WA",
            value: "Washington"
        }, {
            name: "WV",
            value: "West Virginia"
        }, {
            name: "WI",
            value: "Wisconsin"
        }, {
            name: "WY",
            value: "Wyoming"
        }];
    }
})();
(function () {
    'use strict';

    angular.module('saxonApp').directive('autofocus', autofocusDirective);

    function autofocusDirective($timeout) {
        return {
            link: function link(scope, elem, attrs) {
                $timeout(function () {
                    elem[0].focus();
                });
            }
        };
    }
})();
(function () {
    'use strict';

    angular.module('saxonApp').directive('instructions', instructionsDirective);

    function instructionsDirective() {
        return {
            restrict: 'E',
            templateUrl: './app/directives/instructions/instructions.html'
        };
    }
})();
(function () {
    'use strict';

    angular.module('saxonApp').directive('navbar', navbarDirective);

    function navbarDirective() {
        return {
            restrict: 'E',
            templateUrl: './app/directives/navbar/navbar.html'
        };
    }
})();
(function () {
    'use strict';

    angular.module('saxonApp').directive('request', requestDirective);

    function requestDirective() {
        return {
            restrict: 'E',
            templateUrl: './app/directives/request/request.html'
        };
    }
})();
(function () {
    'use strict';

    angular.module('saxonApp').directive('sidebar', sidebarDirective);

    function sidebarDirective() {
        return {
            restrict: 'E',
            templateUrl: './app/directives/sidebar/sidebar.html'
        };
    }
})();