(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .directive('sidebar', sidebarDirective);

	function sidebarDirective() {
		return{
			restrict: 'E',
			templateUrl: './app/directives/sidebar/sidebar.html',		
		};
	}
})();