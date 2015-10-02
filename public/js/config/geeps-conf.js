angular.module("Geeps", ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', '$interpolateProvider', configGeeps]);

function configGeeps($routeProvider, $locationProvider) {

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
            controller: 'EntregadoresCtrl'
        })
        .when('/empresa/pedido', {
            templateUrl: '/templates/pedido.html',
            controller: 'PedidoCtrl'
        })
        .when('/empresa/pedidos', {
            templateUrl: '/templates/pedidos.html',
            controller: 'PedidosCtrl'
        })
        .when('/empresa/relatorios', {
            templateUrl: '/templates/relatorios.html',
            controller: 'RelatoriosCtrl'
        })
        .when('/empresa/pedido/editar', {
            templateUrl: '/templates/editarPedido.html',
            controller: 'PedidoCtrl'
        })
        .otherwise({
            redirectTo: '/empresa/dashboard'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}
