(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$filter', '$state', 'mainService', '$rootScope'];

    function loginCtrl($scope, $filter, $state, mainService, $rootScope) {

        $scope.login = function(user) {
            mainService.login(user).then(function(currUser) {

                if (currUser.userFound !== false) {
                    $rootScope.user = currUser;
                    var username = currUser.username;

                    // mainService.setCookieData($rootScope.user)

                    mainService.getAllHW($rootScope.user.school_id).then(function(response) {
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
                                // $state.go('admin')
                                break;
                        }
                    });
                } else {
                    // change this look/feel
                    alert('Invalid username/password')
                }
            })
        }
    }
})();