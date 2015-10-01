angular.module("Geeps", ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', '$interpolateProvider', configGeeps]);

function configGeeps($routeProvider, $locationProvider, $interpolateProvider) {
    $interpolateProvider.startSymbol('##');
    $interpolateProvider.endSymbol('##');

    $routeProvider
        .when('/empresa/dashboard', {
            templateUrl: '/templates/dashboard.html',
            controller: 'DashboardCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}
