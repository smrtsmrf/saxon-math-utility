(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .directive('request', requestDirective);

	function requestDirective() {
		return{
			restrict: 'E',
			templateUrl: '../views/request.html',
		};
	}
})();