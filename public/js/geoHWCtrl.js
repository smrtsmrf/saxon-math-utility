(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('geoHWCtrl', geoHWCtrl);

    geoHWCtrl.$inject = ['$scope', '$rootScope', 'mainService', '$state'];

    function geoHWCtrl($scope, $rootScope, mainService, $state) {

        console.log('skipped', $rootScope.geoSkipped);

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
        } else {
            populateData();
        }

        function populateData() {
            var data = mainService.allSkippedData.geo;
            var skipped = mainService.allSkippedData.geoSkipped;

            $scope.geoAssignedData = {};
            $scope.geoSkippedData = {};

            for (var j = 1; j <= 120; j++) {
                if (skipped.indexOf(j) == -1) {
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
            }
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