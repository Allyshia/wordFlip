var app = angular.module('wordFlipApp', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/main.html',
            controller: 'MessageMainController'
        }).when('/:messageId', {
            templateUrl: 'partials/message-detail.html',
            controller: 'MessageDetailController'
        }).otherwise({
            redirectTo: '/'
        });
    }]);