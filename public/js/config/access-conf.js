angular.module("GeepsAccess", ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', configGeeps]);

function configGeeps($routeProvider, $locationProvider, $interpolateProvider) {

    $routeProvider
        .when('/auth/login', {
            templateUrl: '/templates/login.html',
            controller: 'AccessCtrl'
        })
        .when('/auth/register', {
            templateUrl: '/templates/register.html',
            controller: 'AccessCtrl'
        })
        .otherwise({
            redirectTo: '/auth/login'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}

