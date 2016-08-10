(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('alg2HWCtrl', alg2HWCtrl);

    alg2HWCtrl.$inject = ['$scope', '$rootScope', 'mainService', '$state'];

    function alg2HWCtrl($scope, $rootScope, mainService, $state) {

        console.log('skipped', $rootScope.alg2Skipped);
        console.log('account type', $rootScope.accountType);

        if (!$rootScope.alg2Skipped) $rootScope.alg2Skipped = '';


        // mainService.updateAndGetHW($rootScope.alg2Skipped, $rootScope.school_id, 'alg2').then(function(data) {
        var data = mainService.allSkippedData.alg2;

        data = mainService.allSkippedData.alg2;
        $scope.alg2AssignedData = {};
        $scope.alg2SkippedData = {};

        for (var j = 1; j <= 120; j++) {
            $scope.alg2AssignedData[j] = {};
            $scope.alg2AssignedData[j].lesson = j;
            $scope.alg2AssignedData[j].problems = [];
            $scope.alg2SkippedData[j] = {};
            $scope.alg2SkippedData[j].lesson = j;
            $scope.alg2SkippedData[j].problems = [];

            for (var i = 0; i < data.length; i++) {
                var problems = data[i];
                if (problems.lessonNum == j && problems.assigned == true) {
                    $scope.alg2AssignedData[j].problems.push(problems.problemNum)
                } else if (problems.lessonNum == j && problems.assigned == false) {
                    $scope.alg2SkippedData[j].problems.push(problems.problemNum)
                }
            }

            $scope.alg2AssignedData[j].problems = getRanges($scope.alg2AssignedData[j].problems)
            $scope.alg2SkippedData[j].problems = getRanges($scope.alg2SkippedData[j].problems)
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
        // console.log($scope.alg2AssignedData);
        // console.log(data);

        // })
    }
})();


// (function() {
//     'use strict';

//     angular
//         .module('saxonApp')
//         .controller('alg2HWCtrl', alg2HWCtrl);

//     alg2HWCtrl.$inject = ['$scope', '$rootScope', 'mainService'];

//     function alg2HWCtrl($scope, $rootScope, mainService) {
//         console.log('skipped', $rootScope.alg2Skipped);
//         console.log('account type', $rootScope.accountType);

//         if (!$rootScope.alg2Skipped) $rootScope.alg2Skipped = '';

//         mainService.updateAndGetHW($rootScope.alg2Skipped, $rootScope.school_id, 'alg2').then(function(data) {
//             console.log('data.length',data.length);
//             $scope.alg2AssignedData = {};
//             $scope.alg2SkippedData = {};

//             for (var j = 1; j <= 120; j++) {
//                 $scope.alg2AssignedData[j] = {};
//                 $scope.alg2AssignedData[j].lesson = j;
//                 $scope.alg2AssignedData[j].problems = [];
//                 $scope.alg2SkippedData[j] = {};
//                 $scope.alg2SkippedData[j].lesson = j;
//                 $scope.alg2SkippedData[j].problems = [];

//                 for (var i = 0; i < data.length; i++) {
//                     var problems = data[i];
//                     if (problems.lessonNum == j && problems.assigned == true) {
//                         $scope.alg2AssignedData[j].problems.push(problems.problemNum)
//                     } else if (problems.lessonNum == j && problems.assigned == false) {
//                         $scope.alg2SkippedData[j].problems.push(problems.problemNum)
//                     }
//                 }

//                 $scope.alg2AssignedData[j].problems = getRanges($scope.alg2AssignedData[j].problems)
//                 $scope.alg2SkippedData[j].problems = getRanges($scope.alg2SkippedData[j].problems)
//             }

//             function getRanges(array) {
//                 array.sort(function(a, b) {
//                     return a - b;
//                 });
//                 var ranges = [],
//                     rstart, rend;
//                 for (var i = 0; i < array.length; i++) {
//                     rstart = array[i];
//                     rend = rstart;
//                     while (array[i + 1] - array[i] == 1) {
//                         rend = array[i + 1]; // increment the index if the numbers sequential
//                         i++;
//                     }
//                     ranges.push(rstart == rend ? rstart + '' : rstart + '-' + rend);
//                 }
//                 return ranges;
//             }
//             // console.log($scope.alg2AssignedData);
//             // console.log(data);
//         })
//     }
// })();