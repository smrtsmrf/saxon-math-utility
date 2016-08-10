(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('algCtrl', algCtrl);

    algCtrl.$inject = ['$scope', '$rootScope', '$state', 'mainService'];

    function algCtrl($scope, $rootScope, $state, mainService) {

        $scope.lessons = mainService.lessons;

        $scope.show = true;

        $scope.updateSkipped = function(lesson) {
            var idx = $rootScope.algSkipped.indexOf(lesson);
            if (idx > -1) {
                $rootScope.algSkipped.splice(idx, 1)
            } else {
                $rootScope.algSkipped.push(lesson)
                $rootScope.algSkipped.sort(function(a, b) {
                    return a - b;
                })
            }
        }

        $scope.storeSkipped = function(subject) {
            mainService.storeSkipped(subject, $rootScope.algSkipped, $rootScope.user.school_id).then(function() {
                $state.go(subject+'hw')
            });
            
        }

        $scope.reset = function() {
            $rootScope.algSkipped = [];
        }

        $scope.logout = function() {
            mainService.logout()
            $rootScope.user = {};
        }

    }
})();