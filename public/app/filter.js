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