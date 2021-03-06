(function() {
    'use strict';

    angular
        .module('saxonApp', [
            'ui.router', 'ngGrid'
        ]);
})();

(function() {
    'use strict';

    angular
        .module('saxonApp')
        .run(function($rootScope, $state) {
            $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
                $rootScope.requested = {
                    url: toState.name,
                    subject: toParams.subject
                }
                console.log($rootScope.requested);
                if (error == "Not Authorized") {
                    console.log('not authorized');
                    $state.go($state.current.name);
                } else if (error == "Not Logged In") {
                    console.log('not logged in');
                    $state.go('login')
                }

            })
        })
})();

(function() {
    'use strict';

    angular
        .module('saxonApp')
        .config(saxonAppConfig);

    saxonAppConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function saxonAppConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: '/app/components/login/login.html',
                controller: 'loginCtrl'
            })

            .state('signup', {
                url: '/signup',
                templateUrl: '/app/components/signup/signup.html',
                controller: 'signupCtrl'
            })

            .state('modify', {
                url: '/:subject/modify',
                templateUrl: '/app/components/modify/modify.html',
                controller: 'modifyCtrl',
                resolve: {
                    security: ['mainService',
                        function(mainService) {
                            return mainService.isAuthed();
                        }
                    ]
                }
            })

            .state('hw', {
                url: '/:subject/hw',
                templateUrl: '/app/components/hw/hw.html',
                controller: 'hwCtrl',
                resolve: {
                    security: ['mainService',
                        function(mainService) {
                            return mainService.isLoggedIn();
                        }
                    ]
                }
            })

            .state('admin', {
                url: '/admin',
                templateUrl: '/app/components/admin/admin.html',
                controller: 'adminCtrl',
                resolve: {
                    security: ['mainService',
                        function(mainService) {
                            return mainService.isAuthed();
                        }
                    ]
                }
            })

        $urlRouterProvider.otherwise('/')
    }
})();