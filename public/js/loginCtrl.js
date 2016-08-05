(function() {
    'use strict';

    angular
        .module('saxonApp')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$filter', '$state', 'mainService', '$rootScope'];

    function loginCtrl($scope, $filter, $state, mainService, $rootScope) {
        
        $scope.login = function(user) {
        	mainService.login(user).then(function(data) {
        		console.log(data);
        		if (!data.userNotFound) {
        			$rootScope.school_id = data.currentUser.school_id;
        			$rootScope.accountType = data.currentUser.type;
        			var username = data.currentUser.username;
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
        			
        		}
        		else {
        			// change this look/feel
        			alert('Invalid username/password')
        		}
        	})


            
        }

      }
})();