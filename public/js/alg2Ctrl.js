(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('alg2Ctrl', alg2Ctrl);

    alg2Ctrl.$inject = ['$scope', '$rootScope', '$state', 'mainService'];

    function alg2Ctrl($scope, $rootScope, $state, mainService) {
        if (!$rootScope.alg2Skipped) {
            $rootScope.alg2Skipped = [];
        }

        $scope.lessons = [];
        for (var i = 1; i <= 120; i++) {
            $scope.lessons.push(i)
        };

        $scope.show = true;
        $scope.remove = function(idx) {
            $scope.show = !$scope.show;
        }

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

        $scope.printSkipped = function() {
            console.log($rootScope.alg2Skipped);
        }

        $scope.storeSkipped = function(subject) {
            console.log('storing alg2');
            mainService.storeSkipped(subject, $rootScope.alg2Skipped, $rootScope.school_id).then(function() {
                $state.reload(subject+'hw')
                $state.go(subject+'hw')
            });
        }

        $scope.reset = function() {
            $rootScope.alg2Skipped = [];
        }

    }
})();