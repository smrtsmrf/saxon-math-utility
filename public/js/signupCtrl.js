(function() {
	'use strict';

	angular
	  .module('saxonApp')
	  .controller('signupCtrl', signupCtrl);

	signupCtrl.$inject = ['$scope', 'mainService', '$state'];

	function signupCtrl($scope, mainService, $state) {
		$scope.signup = function(user) {
			console.log('yay');
			console.log($scope.user);
			mainService.createSchoolAndUsers(user).then(function(data) {
				// change this to a modal
				alert('accounts created!');
				$state.go('login')
			});

		}


		$scope.options = [
			{name:"AL", value: "Alabama"}, 
		      {name: "AK", value: "Alaska"}, 
		      {name: "AZ", value: "Arizona"},
		      {name: "AR", value: "Arkansas"},
		      {name: "CA", value: "California"},
		      {name: "CO", value: "Colorado"}, 
		      {name: "CT", value: "Connecticut"},
		      {name: "DE", value: "Delaware"}, 
		      {name: "DC", value: "District Of Columbia"}, 
		      {name: "FL", value: "Florida"}, 
		      {name: "GA", value: "Georgia"},
		      {name: "HI", value: "Hawaii"}, 
		      {name: "ID", value: "Idaho"},
		      {name: "IL", value: "Illinois"},
		      {name: "IN", value: "Indiana"},
		      {name: "IA", value: "Iowa"},
		      {name: "KS", value: "Kansas"},
		      {name: "KY", value: "Kentucky"},
		      {name: "LA", value: "Louisiana"},
		      {name: "ME", value: "Maine"},
		      {name: "MD", value: "Maryland"},
		      {name: "MA", value: "Massachusetts"},
		      {name: "MI", value: "Michigan"},
		      {name: "MN", value: "Minnesota"},
		      {name: "MS", value: "Mississippi"},
		      {name: "MO", value: "Missouri"},
		      {name: "MT", value: "Montana"},
		      {name: "NE", value: "Nebraska"},
		      {name: "NV", value: "Nevada"},
		      {name: "NH", value: "New Hampshire"},
		      {name: "NJ", value: "New Jersey"},
		      {name: "NM", value: "New Mexico"},
		      {name: "NY", value: "New York"},
		      {name: "NC", value: "North Carolina"},
		      {name: "ND", value: "North Dakota"},
		      {name: "OH", value: "Ohio"},
		      {name: "OK", value: "Oklahoma"},
		      {name: "OR", value: "Oregon"},
		      {name: "PA", value: "Pennsylvania"},
		      {name: "RI", value: "Rhode Island"},
		      {name: "SC", value: "South Carolina"},
		      {name: "SD", value: "South Dakota"},
		      {name: "TN", value: "Tennessee"},
		      {name: "TX", value: "Texas"},
		      {name: "UT", value: "Utah"},
		      {name: "VT", value: "Vermont"},
		      {name: "VA", value: "Virginia"},
		      {name: "WA", value: "Washington"},
		      {name: "WV", value: "West Virginia"},
		      {name: "WI", value: "Wisconsin"},
		      {name: "WY", value: "Wyoming"}
		]
	}
})();