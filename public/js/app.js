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
                $rootScope.requestedUrl = toState.name;
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
                templateUrl: '/views/login.html',
                controller: 'loginCtrl'
            })

        .state('signup', {
            url: '/signup',
            templateUrl: '/views/signup.html',
            controller: 'signupCtrl'
        })

        .state('alghome', {
            url: '/alg',
            templateUrl: './views/alghome.html',
            controller: 'algCtrl',
            resolve: {
                security: ['mainService',
                    function(mainService) {
                        return mainService.isAuthed();
                    }
                ]
            }
        })

        .state('alghw', {
            url: '/alg/hw',
            templateUrl: '/views/alghw.html',
            controller: 'algHWCtrl',
            resolve: {
                security: ['mainService',
                    function(mainService) {
                        return mainService.isLoggedIn();
                    }
                ]
            }
        })

        .state('geohome', {
            url: '/geo',
            templateUrl: './views/geohome.html',
            controller: 'geoCtrl',
            resolve: {
                security: ['mainService',
                    function(mainService) {
                        return mainService.isAuthed();
                    }
                ]
            }
        })

        .state('geohw', {
            url: '/geo/hw',
            templateUrl: '/views/geohw.html',
            controller: 'geoHWCtrl',
            resolve: {
                security: ['mainService',
                    function(mainService) {
                        return mainService.isLoggedIn();
                    }
                ]
            }
        })

        .state('alg2home', {
            url: '/alg2',
            templateUrl: './views/alg2home.html',
            controller: 'alg2Ctrl',
            resolve: {
                security: ['mainService',
                    function(mainService) {
                        return mainService.isAuthed();
                    }
                ]
            }
        })

        .state('alg2hw', {
            url: '/alg2/hw',
            templateUrl: '/views/alg2hw.html',
            controller: 'alg2HWCtrl',
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
            templateUrl: '/views/admin.html',
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

(function() {

    'use strict';

    angular
        .module('saxonApp')
        .filter('orderObjectBy', orderObjectByFilter);

    // orderObjectByFilter.$inject = [''];

    function orderObjectByFilter() {
        return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item) {
                filtered.push(item);
            });
            filtered.sort(function(a, b) {
                return (a[field] > b[field] ? 1 : -1);
            })
            if (reverse) filtered.reverse();
            return filtered;
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('saxonApp')
        .directive('autofocus', autofocusDirective);

    function autofocusDirective($timeout) {
        return {
            link: function(scope, elem, attrs) {
                $timeout(function() {
                    elem[0].focus();
                })
            },
        };
    }
})();