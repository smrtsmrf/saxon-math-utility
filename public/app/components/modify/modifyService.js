(function() {
    'use strict';

    angular
        .module('saxonApp')
        .service('modifyService', modifyService);

    modifyService.$inject = ['$http', 'mainService'];

    function modifyService($http, mainService) {
        var user = '';
        var lessonButtons = [];
        for (var i = 1; i <= 120; i++) {
            lessonButtons.push(i)
            if (i % 10 == 0) {
                lessonButtons.push('INV' + i / 10)
            };
        };

        this.lessons = lessonButtons;

        this.deleteAdminKey = function(school_id, adminKey) {
            return $http.delete('/api/schools/' + school_id + '/adminKeys/' + adminKey)
        }

        this.submitAdminKey = function(school_id, adminKey, subject) {
            return $http.get('/api/schools/' + school_id + '/' + subject + '/adminKeys/' + adminKey).then(function(response) {
                return response.data;
            })
        }

        this.requestUpdate = function(school_id, user, adminEmail, subject, shouldDo, doReason, shouldSkip, skipReason) {
            var subject = subject.charAt(0).toUpperCase() + subject.slice(1);
            var doReason = doReason == 'null' ? doReason = null : doReason;
            var skipReason = skipReason == 'null' ? skipReason = null : skipReason;
            return $http.post('/api/email', {
                school_id: school_id,
                user: user,
                adminEmail: adminEmail,
                subject: subject,
                shouldDo: shouldDo,
                doReason: doReason,
                shouldSkip: shouldSkip,
                skipReason: skipReason
            })
        }

        this.storeSkipped = function(subject, skippedLessons, school_id) {
            return $http.put('/api/schools/' + school_id + '/' + subject + '/skipped', {
                skipped: skippedLessons
            }).then(function(results) {
                mainService.allSkippedData[subject] = results.data[subject];
                mainService.allSkippedData[subject + 'Skipped'] = results.data[subject + 'Skipped'];
                return mainService.allSkippedData;
            })
        }
    }
})();