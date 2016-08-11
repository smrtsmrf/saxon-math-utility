(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('algHWCtrl', algHWCtrl);

    algHWCtrl.$inject = ['$scope', '$rootScope', 'mainService', '$state'];

    function algHWCtrl($scope, $rootScope, mainService, $state) {

        // mainService.test().then(function(data) {
        //     $scope.session = data;
        //     $rootScope.user = data.user;
        //     console.log($scope.session);
        // })

        console.log('skipped', $rootScope.algSkipped);

        // mainService.getCookieData().then(function(resp) {
        //     console.log(resp);
        // })

        // console.log($rootScope.user);


        // if (!$rootScope.algSkipped) {

        //     mainService.getAllHW($rootScope.user.school_id).then(function(response) {
        //                 $rootScope.algSkipped = response.algSkipped;
        //                 $rootScope.geoSkipped = response.geoSkipped;
        //                 $rootScope.alg2Skipped = response.alg2Skipped;
        //             })
        // }

        var data = mainService.allSkippedData.alg;
        var skipped = mainService.allSkippedData.algSkipped;

        $scope.algAssignedData = {};
        $scope.algSkippedData = {};

        for (var j = 1; j <= 120; j++) {
            if (skipped.indexOf(j) == -1) {
                $scope.algAssignedData[j] = {};
                $scope.algAssignedData[j].lesson = j;
                $scope.algAssignedData[j].problems = [];
                $scope.algSkippedData[j] = {};
                $scope.algSkippedData[j].lesson = j;
                $scope.algSkippedData[j].problems = [];

                for (var i = 0; i < data.length; i++) {
                    var problems = data[i];
                    if (problems.lessonNum == j && problems.assigned == true) {
                        $scope.algAssignedData[j].problems.push(problems.problemNum)
                    } else if (problems.lessonNum == j && problems.assigned == false) {
                        $scope.algSkippedData[j].problems.push(problems.problemNum)
                    }
                }

                $scope.algAssignedData[j].problems = getRanges($scope.algAssignedData[j].problems)
                $scope.algSkippedData[j].problems = getRanges($scope.algSkippedData[j].problems)
            };
        }

        function getRanges(array) {
            array.sort(function(a, b) {
                return a - b;
            });
            var ranges = [],
                rstart, rend;
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

        $scope.logout = function() {
            mainService.logout()
            $rootScope.user = {};
        }
    }
})();