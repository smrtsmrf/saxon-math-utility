(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('geoCtrl', geoCtrl);

    geoCtrl.$inject = ['$scope', '$rootScope','mainService', '$state'];

    function geoCtrl($scope, $rootScope, mainService, $state) {

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
        }

        $scope.storeSkipped = function(subject) {
            mainService.storeSkipped(subject, $rootScope.geoSkipped, $rootScope.user.school_id).then(function() {
                $state.go(subject+'hw')
            });
        }

        $scope.reset = function() {
            $rootScope.geoSkipped = [];
        }

        $scope.logout = function() {
            mainService.logout()
            $rootScope.user = {};
        }

    }
})();