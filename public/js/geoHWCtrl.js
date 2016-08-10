(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('geoHWCtrl', geoHWCtrl);

    geoHWCtrl.$inject = ['$scope', '$rootScope', 'mainService', '$state'];

    function geoHWCtrl($scope, $rootScope, mainService, $state) {

        console.log('skipped', $rootScope.geoSkipped);
        console.log('account type', $rootScope.accountType);

        if (!$rootScope.geoSkipped) $rootScope.geoSkipped = '';


        // mainService.updateAndGetHW($rootScope.geoSkipped, $rootScope.school_id, 'geo').then(function(data) {
        var data = mainService.allSkippedData.geo;

        data = mainService.allSkippedData.geo;
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
                var problems = data[i];
                if (problems.lessonNum == j && problems.assigned == true) {
                    $scope.geoAssignedData[j].problems.push(problems.problemNum)
                } else if (problems.lessonNum == j && problems.assigned == false) {
                    $scope.geoSkippedData[j].problems.push(problems.problemNum)
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

        // })
    }
})();