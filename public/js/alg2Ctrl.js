(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('alg2Ctrl', alg2Ctrl);

    alg2Ctrl.$inject = ['$scope', '$rootScope', '$state', 'mainService'];

    function alg2Ctrl($scope, $rootScope, $state, mainService) {

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
        }

        $scope.storeSkipped = function(subject) {
            mainService.storeSkipped(subject, $rootScope.alg2Skipped, $rootScope.user.school_id).then(function() {
                $state.go(subject+'hw')
            });
        }

        $scope.reset = function() {
            $rootScope.alg2Skipped = [];
        }

        $scope.logout = function() {
            mainService.logout()
            $rootScope.user = {};
        }

    }
})();