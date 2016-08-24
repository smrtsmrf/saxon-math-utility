(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$filter', '$state', 'mainService', '$rootScope', 'loginService'];

    function loginCtrl($scope, $filter, $state, mainService, $rootScope, loginService) {

        $scope.loading = false;
        
        $scope.login = function(user) {
            $scope.loading = true
            // mainService.login(user).then(function(currUser) {
            loginService.login(user).then(function(currUser) {

                if (currUser.userFound !== false) {
                    $rootScope.user = currUser;
                    var username = currUser.username;

                    mainService.getAllHW($rootScope.user.school_id).then(function(response) {
                        $rootScope.algSkipped = response.algSkipped;
                        $rootScope.geoSkipped = response.geoSkipped;
                        $rootScope.alg2Skipped = response.alg2Skipped;
                        switch (true) {
                            case $rootScope.requested != undefined:
                                $state.go($rootScope.requested.url, {subject: $rootScope.requested.subject});
                                break;
                            case username.toLowerCase().includes('alg2'):
                                $state.go('hw', {subject: 'alg2'});
                                break;
                            case username.toLowerCase().includes('geo'):
                                $state.go('hw', {subject: 'geo'});
                                break;
                            case $rootScope.user.type == 'admin':
                                var today = new Date();
                                // mainService.removeOldKeys($rootScope.user.school_id, today)
                                loginService.removeOldKeys($rootScope.user.school_id, today)
                                $state.go('admin');
                                break;
                            default:
                                $state.go('hw', {subject: 'alg'});
                                break;
                        }
                    });
                } else {
                    alertify.error('Invalid username/password', 5);
                    $scope.loading = false;
                    $scope.user = {};
                }
            })
        }
    }
})();