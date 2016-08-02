(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .service('mainService', mainService);

	mainService.$inject = ['$http'];

	function mainService($http) {
		this.updateAndGetAlg = function (skippedLessons) {
			return $http.put('/api/alg?lessonRef=' + JSON.stringify(skippedLessons)).then(function(results) {
				return results.data;
			})
		}

		this.updateAndGetGeo = function(skippedLessons) {
			return $http.put('/api/geo?lessonRef=' + JSON.stringify(skippedLessons)).then(function(results) {
					return results.data;
			})
		}

		this.updateAndGetAlg2 = function(skippedLessons) {
			return $http.put('/api/alg2?lessonRef=' + JSON.stringify(skippedLessons)).then(function(results) {
					return results.data;
			})
		}

		// this.resetAlg = function() {
		// 	return $http.put('/api/alg/reset');
		// }

		// this.resetGeo = function() {
		// 	return $http.put('/api/geo/reset');
		// }

		// this.resetAlg2 = function() {
		// 	return $http.put('/api/alg2/reset');
		// }
	}
})();