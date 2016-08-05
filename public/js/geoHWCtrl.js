(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('geoHWCtrl', geoHWCtrl);

    geoHWCtrl.$inject = ['$scope', '$rootScope', 'mainService'];

    function geoHWCtrl($scope, $rootScope, mainService) {
        console.log('skipped', $rootScope.geoSkipped);

        if (!$rootScope.geoSkipped) $rootScope.geoSkipped = '';

        mainService.updateAndGetHW($rootScope.geoSkipped, $rootScope.school_id, 'geo').then(function(data) {
            console.log('data.length',data.length);
            $scope.geoAssignedData = {};
            $scope.geoSkippedData = {};

            for (var j = 1; j <= 120; j++) {
                $scope.geoAssignedData[j] = {};
                $scope.geoAssignedData[j].lesson = j;
                $scope.geoAssignedData[j].problems = [];
                $scope.geoSkippedData[j] = {};
                $scope.geoSkippedData[j].lesson = j;
                $scope.geoSkippedData[j].problems = [];

                for (var i = 0; i < data.length; i++) {
                    if (data[i].problems.lessonNum == j && data[i].problems.assigned == true) {
                        $scope.geoAssignedData[j].problems.push(data[i].problems.problemNum)
                    } else if (data[i].problems.lessonNum == j && data[i].problems.assigned == false) {
                        $scope.geoSkippedData[j].problems.push(data[i].problems.problemNum)
                    }
                }

                $scope.geoAssignedData[j].problems = getRanges($scope.geoAssignedData[j].problems)
                $scope.geoSkippedData[j].problems = getRanges($scope.geoSkippedData[j].problems)
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
            // console.log($scope.geoAssignedData);
            // console.log(data);
        })
    }
})();