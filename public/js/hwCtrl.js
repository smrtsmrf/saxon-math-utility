(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('hwCtrl', hwCtrl);

    hwCtrl.$inject = ['$scope', '$rootScope', 'mainService', '$state', '$stateParams'];

    function hwCtrl($scope, $rootScope, mainService, $state, $stateParams) {

        $scope.subject = $stateParams.subject;
        var subject = $scope.subject;
        $scope.subjectTitle = subject == 'alg' ? 'Algebra' : (subject == 'geo' ? 'Geometry' : 'Algebra II')

        console.log('skipped', $rootScope[subject+'Skipped']);

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
            var data = mainService.allSkippedData[subject];
            var skipped = mainService.allSkippedData[subject+'Skipped'];

            $scope[subject+'AssignedData'] = {};
            $scope[subject+'SkippedData'] = {};

            var assignedData = $scope[subject+'AssignedData'];
            var skippedData = $scope[subject+'SkippedData'];


            for (var j = 1; j <= 120; j++) {
                if ($rootScope[subject+'Skipped'].indexOf(j) == -1) {
                    assignedData[j] = {};
                    assignedData[j].lesson = j;
                    assignedData[j].problems = [];
                    skippedData[j] = {};
                    skippedData[j].lesson = j;
                    skippedData[j].problems = [];

                    for (var i = 0; i < data.length; i++) {
                        var problems = data[i];
                        if (problems.lessonNum == j && problems.assigned == true) {
                            assignedData[j].problems.push(problems.problemNum)
                        } else if (problems.lessonNum == j && problems.assigned == false) {
                            skippedData[j].problems.push(problems.problemNum)
                        }
                    }

                    assignedData[j].problems = getRanges(assignedData[j].problems)
                    skippedData[j].problems = getRanges(skippedData[j].problems)
                };
            }
            
            $scope.assigned = $scope[subject+'AssignedData'];
            $scope.skipped = $scope[subject+'SkippedData'];
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