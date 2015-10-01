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
        .when('/empresa/entregador', {
            templateUrl: '/templates/entregador.html',
            controller: 'EntregadorCtrl'
        })
        .when('/empresa/entregadores', {
            templateUrl: '/templates/entregadores.html',
            controller: 'EntregadorCtrl'
        })
        .when('/empresa/pedido', {
            templateUrl: '/templates/pedido.html',
            controller: 'PedidoCtrl'
        })
        .when('/empresa/pedidos', {
            templateUrl: '/templates/pedidos.html',
            controller: 'PedidoCtrl'
        })
        .when('/empresa/relatorios', {
            templateUrl: '/templates/relatorios.html',
            controller: 'RelatoriosCtrl'
        })
        .otherwise({
            redirectTo: '/empresa/dashboard'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}
