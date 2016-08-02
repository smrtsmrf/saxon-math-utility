(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .service('mainService', mainService);

	mainService.$inject = ['$http'];

	function mainService($http) {
		this.getAlg = function (skippedLessons) {
			return $http.get('/api/alg?lessonRef=' + JSON.stringify(skippedLessons)).then(function(results) {
				return results.data;
			})
		}

		this.getGeo = function(skippedLessons) {
			return $http.get('/api/geo?lessonRef=' + JSON.stringify(skippedLessons)).then(function(results) {
					return results.data;
			})
		}

		this.getAlg2 = function(skippedLessons) {
			return $http.get('/api/alg2?lessonRef=' + JSON.stringify(skippedLessons)).then(function(results) {
					return results.data;
			})
		}
	}
})();