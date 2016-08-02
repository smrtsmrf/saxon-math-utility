(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .controller('geoCtrl', geoCtrl);

	geoCtrl.$inject = ['$scope', '$rootScope'];

	function geoCtrl($scope, $rootScope) {
		if (!$rootScope.geoSkipped) {
			$rootScope.geoSkipped = [];
		}
	
		$scope.lessons = [];
		for (var i = 1; i <= 120; i++) {
			$scope.lessons.push(i)
		};

		$scope.show = true;
		$scope.remove = function(idx) {
			$scope.show = !$scope.show;
		}

		$scope.updateSkipped = function(lesson) {
			var idx = $rootScope.geoSkipped.indexOf(lesson);
			if (idx > -1) {
				$rootScope.geoSkipped.splice(idx, 1)
			}
			else {
				$rootScope.geoSkipped.push(lesson)
			}
		}

		$scope.printSkipped = function() {
			console.log($rootScope.geoSkipped);
		}

		$scope.reset = function() {
			$rootScope.geoSkipped = [];
		}

	}
})();