(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .directive('buttons', buttonsDirective);

	function buttonsDirective() {
		return{
			restrict: 'E',
			templateUrl: '../views/buttons.html',
		};
	}
})();