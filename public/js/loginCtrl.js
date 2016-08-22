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

                    mainService.getAllHW($rootScope.user.school_id).then(function(response) {
                        $rootScope.algSkipped = response.algSkipped;
                        $rootScope.geoSkipped = response.geoSkipped;
                        $rootScope.alg2Skipped = response.alg2Skipped;
                        switch (true) {
                            case $rootScope.requestedUrl != undefined:
                                $state.go($rootScope.requestedUrl);
                                break;
                            case username.toLowerCase().includes('alg2'):
                                $state.go('alg2hw');
                                break;
                            case username.toLowerCase().includes('geo'):
                                $state.go('geohw');
                                break;
                            case $rootScope.user.type == 'admin':
                                $state.go('admin');
                                break;
                            default:
                                $state.go('alghw');
                                break;
                        }
                    });
                } else {
                    alertify.error('Invalid username/password', 5);
                    // alertify.alert('Error', 'Invalid username/password')
                }
            })
        }
    }
})();