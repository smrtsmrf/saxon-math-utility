(function() {
    'use strict';

    angular
        .module('saxonApp', [
            'ui.router'
        ]);
})();

(function() {
    'use strict';

    angular
      .module('saxonApp')
      .run(function($rootScope, $state) {
          $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error){
                        if (error == "Not Authorized") $state.go($state.current.name)
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
                security: ['$http', '$q', function($http, $q) {
                    var deferred = $q.defer();
                    return $http.get('/api/isAuthed').then(function(auth) {
                        var type = auth.data;
                        if (type !== 'admin') {
                            deferred.reject('Not Authorized')
                        } else {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    })
                }]
            }
        })

        .state('alghw', {
            url: '/alg/hw',
            templateUrl: '/views/alghw.html',
            controller: 'algHWCtrl'
        })

        .state('geohome', {
            url: '/geo',
            templateUrl: './views/geohome.html',
            controller: 'geoCtrl',
            resolve: {
                security: ['$http', '$q', function($http, $q) {
                    var deferred = $q.defer();
                    return $http.get('/api/isAuthed').then(function(auth) {
                        var type = auth.data;
                        if (type !== 'admin') {
                            deferred.reject('Not Authorized')
                        } else {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    })
                }]
            }
        })

        .state('geohw', {
            url: '/geo/hw',
            templateUrl: '/views/geohw.html',
            controller: 'geoHWCtrl'
        })

        .state('alg2home', {
            url: '/alg2',
            templateUrl: './views/alg2home.html',
            controller: 'alg2Ctrl',
            resolve: {
                security: ['$http', '$q', function($http, $q) {
                    var deferred = $q.defer();
                    return $http.get('/api/isAuthed').then(function(auth) {
                        var type = auth.data;
                        if (type !== 'admin') {
                            deferred.reject('Not Authorized')
                        } else {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    })
                }]
            }
        })

        .state('alg2hw', {
            url: '/alg2/hw',
            templateUrl: '/views/alg2hw.html',
            controller: 'alg2HWCtrl'
        })

        .state('admin', {
            url: '/admin',
            templateUrl: '/views/admin.html',
            controller: 'adminCtrl',
            resolve: {
                security: ['$http', '$q', function($http, $q) {
                    var deferred = $q.defer();
                    return $http.get('/api/isAuthed').then(function(auth) {
                        var type = auth.data;
                        if (type !== 'admin') {
                            deferred.reject('Not Authorized')
                        } else {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    })
                }]
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