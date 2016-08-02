(function() {
	'use strict';

	angular
	  .module('saxonApp', [
	      'ui.router'
	  ]);
})();


(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .config(saxonAppConfig);

	saxonAppConfig.$inject = ['$stateProvider','$urlRouterProvider'];

	function saxonAppConfig($stateProvider,$urlRouterProvider) {
		$stateProvider
		.state('login', {
			url: '/', 
			templateUrl: '/views/login.html',
			controller: 'loginCtrl'
		})

		.state('alghome', {
			url: '/alg',
			templateUrl: './views/alghome.html', 
			controller: 'algCtrl'
		})

		.state('alghw', {
			url: '/alg/hw',
			// parent: 'geohw',
			templateUrl: '/views/alghw.html',
			controller: function($scope, $rootScope, mainService) {
				console.log('skipped',$rootScope.skipped);
				mainService.getAlg($rootScope.skipped).then(function(data) {
					$scope.algData = data
					console.log(data);
				})
			}
		})

		.state('geohome', {
			url: '/geo',
			templateUrl: './views/geohome.html', 
			controller: 'geoCtrl'
		})

		.state('geohw', {
			url: '/geo/hw',
			// parent: 'geohw',
			templateUrl: '/views/geohw.html',
			controller: function($scope, $rootScope, mainService) {
				console.log('skipped',$rootScope.skipped);
				mainService.getGeo($rootScope.skipped).then(function(data) {
					$scope.geoData = data
					console.log(data);
				})
			}
		})

		.state('alg2home', {
			url: '/alg2',
			templateUrl: './views/alg2home.html', 
			controller: 'alg2Ctrl'
		})

		.state('alg2hw', {
			url: '/alg2/hw',
			// parent: 'geohw',
			templateUrl: '/views/alg2hw.html',
			controller: function($scope, $rootScope, mainService) {
				console.log('skipped',$rootScope.skipped);
				mainService.getAlg2($rootScope.skipped).then(function(data) {
					$scope.alg2Data = data
					console.log(data);
				})
			}
		})

		$urlRouterProvider.otherwise('/geo')
	}
})();