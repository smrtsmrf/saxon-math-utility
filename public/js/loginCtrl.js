(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$filter', '$state', 'mainService', '$rootScope', '$q'];

    function loginCtrl($scope, $filter, $state, mainService, $rootScope, $q) {

        $scope.login = function(user) {
            mainService.login(user).then(function(currUser) {

                if (currUser.userFound !== false) {
                    $rootScope.school_id = currUser.school_id;
                    $rootScope.accountType = currUser.type;
                    $rootScope.username = currUser.username;
                    var username = currUser.username;

                    mainService.getAllHW($rootScope.school_id).then(function(response) {
                        $rootScope.algSkipped = response.algSkipped;
                        $rootScope.geoSkipped = response.geoSkipped;
                        $rootScope.alg2Skipped = response.alg2Skipped;
                        switch (true) {
                            case username.includes('alg2'):
                                $state.go('alg2hw');
                                break;
                            case username.includes('geo'):
                                $state.go('geohw');
                                break;
                            default:
                                $state.go('alghw');
                                break;
                        }
                    });

                    // $scope.loaded = 0;



                    //     mainService.getSkipped('alg', $rootScope.school_id).then(function(skipped) {
                    //         $rootScope.algSkipped = skipped;
                    //         $scope.loaded++;
                    //         console.log('loaded alg', $scope.loaded);

                    //         console.log($rootScope.algSkipped);
                    //     })
                    //     mainService.getSkipped('geo', $rootScope.school_id).then(function(skipped) {
                    //         $rootScope.geoSkipped = skipped;
                    //         console.log($rootScope.geoSkipped);
                    //         $scope.loaded++;
                    //         console.log('loaded geo', $scope.loaded);
                    //     })
                    //     mainService.getSkipped('alg2', $rootScope.school_id).then(function(skipped) {
                    //         $rootScope.alg2Skipped = skipped;
                    //         console.log($rootScope.alg2Skipped);
                    //         $scope.loaded++;
                    //         console.log('loaded alg2', $scope.loaded);
                    //     })


                    // // console.log('loaded = ', loaded);

                    // $scope.$watch('loaded', function() {
                    //     if ($scope.loaded === 3) {
                    //         console.log('loaded');
                    //         switch (true) {
                    //             case username.includes('alg2'):
                    //                 $state.go('alg2hw');
                    //                 break;
                    //             case username.includes('geo'):
                    //                 $state.go('geohw');
                    //                 break;
                    //             default:
                    //                 $state.go('alghw');
                    //                 break;
                    //         }
                    //     }
                    // })





                } else {
                    // change this look/feel
                    alert('Invalid username/password')
                }
            })



        }

    }
})();