(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .controller('algCtrl', algCtrl);

	algCtrl.$inject = ['$scope', '$rootScope'];

	function algCtrl($scope, $rootScope) {
		if (!$rootScope.algSkipped) {
			$rootScope.algSkipped = [];
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
			var idx = $rootScope.algSkipped.indexOf(lesson);
			if (idx > -1) {
				$rootScope.algSkipped.splice(idx, 1)
			}
			else {
				$rootScope.algSkipped.push(lesson)
			}
		}

		$scope.printSkipped = function() {
			console.log($rootScope.algSkipped);
		}

		$scope.reset = function() {
			$rootScope.algSkipped = [];
		}

	}
})();