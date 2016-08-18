(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .directive('instructions', instructionsDirective);

	function instructionsDirective() {
		return{
			restrict: 'E',
			templateUrl: '../views/instructions.html',		
		};
	}
})();