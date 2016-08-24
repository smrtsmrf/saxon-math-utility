(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .directive('instructions', instructionsDirective);

	function instructionsDirective() {
		return{
			restrict: 'E',
			templateUrl: './app/directives/instructions/instructions.html',		
		};
	}
})();