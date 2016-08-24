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