(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('alg2Ctrl', alg2Ctrl);

    alg2Ctrl.$inject = ['$scope', '$rootScope', '$state', 'mainService'];

    function alg2Ctrl($scope, $rootScope, $state, mainService) {
        $scope.saving = false;

        $scope.showAdminKey = false;

        $scope.subject = 'Algebra II';

        var subject = 'alg2';

        var original = mainService.allSkippedData.alg2Skipped;

        revert();

        var unchanged;

        function setButtonText() {
            unchanged = (original.length == $rootScope.alg2Skipped.length) && $rootScope.alg2Skipped.every(function(el, idx) {
                return el == original[idx]
            })
            var update = $rootScope.user.type == 'admin' ? 'Update HW' : 'Request Update';
            $scope.buttonText = unchanged ? 'View HW' : update;
        }

        setButtonText();

        $scope.lessons = mainService.lessons;

        $scope.show = true;

        $scope.updateSkipped = function(lesson) {
            var idx = $rootScope.alg2Skipped.indexOf(lesson);
            if (idx > -1) {
                $rootScope.alg2Skipped.splice(idx, 1)
            } else {
                $rootScope.alg2Skipped.push(lesson)
                $rootScope.alg2Skipped.sort(function(a, b) {
                    return a - b;
                })
            }
            setButtonText();
        }

        $scope.storeSkipped = function() {
            if (unchanged) {
                $state.go(subject + 'hw')
            } else {
                $scope.saving = true;
                mainService.storeSkipped(subject, $rootScope.alg2Skipped, $rootScope.user.school_id).then(function() {
                    $state.go(subject + 'hw')
                });
            }

        }

        $scope.submitAdminKey = function(adminKey) {
            mainService.submitAdminKey($rootScope.user.school_id, adminKey, subject).then(function(result) {
                if (!result.failure) {
                    var shouldDo = JSON.parse("[" + result.shouldDo + "]");
                    var shouldSkip = JSON.parse("[" + result.shouldSkip + "]");
                    $rootScope.alg2Skipped = mainService.allSkippedData.alg2Skipped;

                    shouldDo.forEach(function(element) {
                        var idx = $rootScope.alg2Skipped.indexOf(element);
                        if (idx >= 0) {
                            $rootScope.alg2Skipped.splice(idx, 1)
                        }
                    });

                    shouldSkip.forEach(function(element) {
                        var idx = $rootScope.alg2Skipped.indexOf(element);
                        if (idx < 0) {
                            $rootScope.alg2Skipped.push(element)
                        }
                    });

                    $rootScope.alg2Skipped.sort(function(a, b) {
                        return a - b;
                    })

                    $scope.storeSkipped()

                    mainService.deleteAdminKey($rootScope.user.school_id, adminKey)

                } else {
                    alertify.error(result.failure, 5);
                }

            })

        }

        $scope.reset = function() {
            if ($rootScope.user.type == 'admin') {
                $rootScope.alg2Skipped = [];
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
                return $rootScope.alg2Skipped.indexOf(el) == -1
            });

            if ($scope.shouldDo == false) {
                $scope.doReason = 'null';
            }
            $scope.shouldSkip = $rootScope.alg2Skipped.filter(function(el) {
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

                    mainService.requestUpdate($rootScope.user.school_id, $rootScope.user, admin.email, subject, $scope.shouldDo.toString(), $scope.doReason, $scope.shouldSkip.toString(), $scope.skipReason).then(function() {
                        var msg = 'Your message was sent to ' + admin.email;
                        // alertify.alert('Success!', msg, function() {
                        //     $state.go(subject + 'hw')
                        // });
                        // alertify.notify(msg, 'success', 5, function() {
                        //     $state.go(subject + 'hw');
                        // });
                        alertify.success(msg, 5, function() {
                            $state.go(subject + 'hw')
                        })
                    })
                })
            } else {
                $state.go(subject + 'hw')
            }
        }

        function revert() {
            $rootScope.alg2Skipped = [];
            original.forEach(function(el) {
                $rootScope.alg2Skipped.push(el);
            });
        }
        $scope.resetReason = function() {
            $scope.doReason = null;
            $scope.skipReason = null;
        }

    }
})();