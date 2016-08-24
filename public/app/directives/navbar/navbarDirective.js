(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .directive('navbar', navbarDirective);

	function navbarDirective() {
		return{
			restrict: 'E',
			templateUrl: '../views/navbar.html',			
		};
	}
})();