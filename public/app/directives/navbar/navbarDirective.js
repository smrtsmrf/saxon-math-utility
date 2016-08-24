(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .directive('navbar', navbarDirective);

	function navbarDirective() {
		return{
			restrict: 'E',
			templateUrl: './app/directives/navbar/navbar.html',			
		};
	}
})();