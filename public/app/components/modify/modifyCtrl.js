(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('modifyCtrl', modifyCtrl);

    modifyCtrl.$inject = ['$scope', '$rootScope', '$state', 'mainService', '$stateParams', 'modifyService'];

    function modifyCtrl($scope, $rootScope, $state, mainService, $stateParams, modifyService) {
        if (!$rootScope.user) {
            mainService.retrieveSession().then(function(user) {
                $rootScope.user = user;
                mainService.getAllHW($rootScope.user.school_id).then(function(response) {
                    $rootScope.algSkipped = response.algSkipped;
                    $rootScope.geoSkipped = response.geoSkipped;
                    $rootScope.alg2Skipped = response.alg2Skipped;
                    populateData();
                })
            })
        }

        $scope.saving = false;

        $scope.showAdminKey = false;

        $scope.subject = $stateParams.subject;
        var subject = $scope.subject;

        $scope.subjectTitle = subject == 'alg' ? 'Algebra' : (subject == 'geo' ? 'Geometry' : 'Algebra II')

        var original = mainService.allSkippedData[subject+'Skipped'];

        revert();

        var unchanged;

        function setButtonText() {
            unchanged = (original.length == $rootScope[subject+'Skipped'].length) && $rootScope[subject+'Skipped'].every(function(el, idx) {
                return el == original[idx]
            })
            var update = $rootScope.user.type == 'admin' ? 'Update HW' : 'Request Update';
            $scope.buttonText = unchanged ? 'View HW' : update;
        }

        setButtonText();

        $scope.lessons = modifyService.lessons;

        $scope.show = true;

        $scope.updateSkipped = function(lesson) {
            var idx = $rootScope[subject+'Skipped'].indexOf(lesson);
            if (idx > -1) {
                $rootScope[subject+'Skipped'].splice(idx, 1)
            } else {
                $rootScope[subject+'Skipped'].push(lesson)
                $rootScope[subject+'Skipped'].sort(function(a, b) {
                    return a - b;
                })
            }
            setButtonText();
        }

        $scope.storeSkipped = function() {
            if (unchanged) {
                $state.go('hw', {subject: subject})
            } else {
                $scope.saving = true;
                modifyService.storeSkipped(subject, $rootScope[subject+'Skipped'], $rootScope.user.school_id).then(function() {
                    $state.go('hw', {subject: subject})
                });
            }

        }

        $scope.submitAdminKey = function(adminKey) {
            modifyService.submitAdminKey($rootScope.user.school_id, adminKey, subject).then(function(result) {
                if (!result.failure) {
                    var shouldDo = JSON.parse("[" + result.shouldDo + "]");
                    var shouldSkip = JSON.parse("[" + result.shouldSkip + "]");
                    $rootScope[subject+'Skipped'] = mainService.allSkippedData[subject+'Skipped'];

                    shouldDo.forEach(function(element) {
                        var idx = $rootScope[subject+'Skipped'].indexOf(element);
                        if (idx >= 0) {
                            $rootScope[subject+'Skipped'].splice(idx, 1)
                        }
                    });

                    shouldSkip.forEach(function(element) {
                        var idx = $rootScope[subject+'Skipped'].indexOf(element);
                        if (idx < 0) {
                            $rootScope[subject+'Skipped'].push(element)
                        }
                    });

                    $rootScope[subject+'Skipped'].sort(function(a, b) {
                        return a - b;
                    })

                    $scope.storeSkipped()

                    modifyService.deleteAdminKey($rootScope.user.school_id, adminKey)

                } else {
                    alertify.error(result.failure, 5);
                }

            })

        }

        $scope.reset = function() {
            if ($rootScope.user.type == 'admin') {
                $rootScope[subject+'Skipped'] = [];
            } else {
                revert();
            }
            setButtonText();
        }

        $scope.logout = function() {
            mainService.logout()
            $rootScope.user = {};
        }

        $scope.test = true;

        $scope.preReq = function() {
            $scope.shouldDo = original.filter(function(el, idx) {
                return $rootScope[subject+'Skipped'].indexOf(el) == -1
            });

            if ($scope.shouldDo == false) {
                $scope.doReason = 'null';
            }
            $scope.shouldSkip = $rootScope[subject+'Skipped'].filter(function(el) {
                return original.indexOf(el) == -1
            });

            if ($scope.shouldSkip == false) {
                $scope.skipReason = 'null';
            }

        }

        // need to handle errors
        $scope.requestUpdate = function() {
            if (!$scope.shouldDo) $scope.shouldDo = '';
            if (!$scope.shouldSkip) $scope.shouldSkip = '';
            if ($scope.shouldDo.length > 0 || $scope.shouldSkip.length > 0) {
                $scope.saving = true;
                mainService.findUsers('?school_id=' + $rootScope.user.school_id).then(function(users) {
                    var admin = users.filter(function(user) {
                        return user.type === 'admin';
                    })[0]

                    modifyService.requestUpdate($rootScope.user.school_id, $rootScope.user, admin.email, subject, $scope.shouldDo.toString(), $scope.doReason, $scope.shouldSkip.toString(), $scope.skipReason).then(function() {
                        var msg = 'Your message was sent to ' + admin.email;
                        $state.go('hw', {subject: subject})
                        alertify.success(msg, 5, function() {})
                    })
                })
            } else {
                $state.go('hw', {subject: subject})
            }
        }

        function revert() {
            $rootScope[subject+'Skipped'] = [];
            original.forEach(function(el) {
                $rootScope[subject+'Skipped'].push(el);
            });
        }
        $scope.resetReason = function() {
            $scope.doReason = null;
            $scope.skipReason = null;
        }

    }
})();