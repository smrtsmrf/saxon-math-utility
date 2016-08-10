(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('adminCtrl', adminCtrl);

    adminCtrl.$inject = ['$scope', '$rootScope', 'mainService', '$state'];

    function adminCtrl($scope, $rootScope, mainService, $state) {
        mainService.findUsers('?school_id=' + $rootScope.user.school_id).then(function(data) {
            $scope.users = data;
        });

        $scope.delete = function(username) {
            mainService.deleteUser(username).then(function(users) {
                $scope.users = users;
            })
        };

        $scope.reset = function() {
            mainService.resetAllHW($rootScope.user.school_id).then(function() {
                $state.reload('alghw');
                $state.reload('geohw');
                $state.reload('alg2hw');
                $rootScope.algSkipped = [];
                $rootScope.geoSkipped = [];
                $rootScope.alg2Skipped = [];
            });
        }

        $scope.logout = function() {
            mainService.logout()
            $rootScope.user = {};
        }
    }
})();