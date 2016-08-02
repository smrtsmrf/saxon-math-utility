(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .controller('alg2Ctrl', alg2Ctrl);

	alg2Ctrl.$inject = ['$scope', '$rootScope', 'mainService'];

	function alg2Ctrl($scope, $rootScope, mainService) {
		if (!$rootScope.alg2Skipped) {
			$rootScope.alg2Skipped = [];
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
			var idx = $rootScope.alg2Skipped.indexOf(lesson);
			if (idx > -1) {
				$rootScope.alg2Skipped.splice(idx, 1)
			}
			else {
				$rootScope.alg2Skipped.push(lesson)
			}
		}

		$scope.printSkipped = function() {
			console.log($rootScope.alg2Skipped);
		}

		$scope.reset = function() {
			$rootScope.alg2Skipped = [];
			// mainService.resetAlg2();
		}

	}
})();