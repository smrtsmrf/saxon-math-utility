(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .controller('algCtrl', algCtrl);

	algCtrl.$inject = ['$scope', '$rootScope'];

	function algCtrl($scope, $rootScope) {
		$rootScope.skipped = [];
	
		$scope.lessons = [];
		for (var i = 1; i <= 120; i++) {
			$scope.lessons.push(i)
		};

		$scope.show = true;
		$scope.remove = function(idx) {
			$scope.show = !$scope.show;
		}

		$scope.updateSkipped = function(lesson) {
			var idx = $rootScope.skipped.indexOf(lesson);
			if (idx > -1) {
				$rootScope.skipped.splice(idx, 1)
			}
			else {
				$rootScope.skipped.push(lesson)
			}
		}

		$scope.printSkipped = function() {
			console.log($rootScope.skipped);
		}

	}
})();