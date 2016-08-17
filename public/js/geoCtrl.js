(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('geoCtrl', geoCtrl);

    geoCtrl.$inject = ['$scope', '$rootScope', '$state', 'mainService'];

    function geoCtrl($scope, $rootScope, $state, mainService) {
        $scope.saving = false;

        $scope.showAdminKey = false;

        $scope.subject = 'Geometry';

        var subject = 'geo';

        var original = mainService.allSkippedData.geoSkipped;

        revert();

        var unchanged;

        function setButtonText() {
            unchanged = (original.length == $rootScope.geoSkipped.length) && $rootScope.geoSkipped.every(function(el, idx) {
                return el == original[idx]
            })
            var update = $rootScope.user.type == 'admin' ? 'Update HW' : 'Request Update';
            $scope.buttonText = unchanged ? 'View HW' : update;
        }

        setButtonText();

        $scope.lessons = mainService.lessons;

        $scope.show = true;

        $scope.updateSkipped = function(lesson) {
            var idx = $rootScope.geoSkipped.indexOf(lesson);
            if (idx > -1) {
                $rootScope.geoSkipped.splice(idx, 1)
            } else {
                $rootScope.geoSkipped.push(lesson)
                $rootScope.geoSkipped.sort(function(a, b) {
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
                mainService.storeSkipped(subject, $rootScope.geoSkipped, $rootScope.user.school_id).then(function() {
                    $state.go(subject + 'hw')
                });
            }

        }

        $scope.submitAdminKey = function(adminKey) {
            mainService.submitAdminKey($rootScope.user.school_id, adminKey, subject).then(function(result) {
                if (!result.failure) {
                    var shouldDo = JSON.parse("[" + result.shouldDo + "]");
                    var shouldSkip = JSON.parse("[" + result.shouldSkip + "]");
                    $rootScope.geoSkipped = mainService.allSkippedData.geoSkipped;

                    shouldDo.forEach(function(element) {
                        var idx = $rootScope.geoSkipped.indexOf(element);
                        if (idx >= 0) {
                            $rootScope.geoSkipped.splice(idx, 1)
                        }
                    });

                    shouldSkip.forEach(function(element) {
                        var idx = $rootScope.geoSkipped.indexOf(element);
                        if (idx < 0) {
                            $rootScope.geoSkipped.push(element)
                        }
                    });

                    $rootScope.geoSkipped.sort(function(a, b) {
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
            // if ($rootScope.user.type == 'admin') {
            //     $rootScope.geoSkipped = [];
            // } else {
                revert();
            // }
            setButtonText();
        }

        $scope.logout = function() {
            mainService.logout()
            $rootScope.user = {};
        }

        $scope.test = true;

        $scope.preReq = function() {
            $scope.shouldDo = original.filter(function(el, idx) {
                return $rootScope.geoSkipped.indexOf(el) == -1
            });

            if ($scope.shouldDo == false) {
                $scope.doReason = 'null';
            }
            $scope.shouldSkip = $rootScope.geoSkipped.filter(function(el) {
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
            $rootScope.geoSkipped = [];
            original.forEach(function(el) {
                $rootScope.geoSkipped.push(el);
            });
        }
        $scope.resetReason = function() {
            $scope.doReason = null;
            $scope.skipReason = null;
        }

    }
})();