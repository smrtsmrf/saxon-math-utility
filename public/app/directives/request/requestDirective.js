(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .directive('request', requestDirective);

	function requestDirective() {
		return{
			restrict: 'E',
			templateUrl: './app/directives/request/request.html',
		};
	}
})();