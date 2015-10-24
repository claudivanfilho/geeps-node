angular.module("Geeps", ['ngRoute', 'googlechart', 'chart.js', 'ui.bootstrap', 'angular-stripe'])
    .config(['$routeProvider', '$locationProvider', '$interpolateProvider', configGeeps])
    .config(function (stripeProvider) {
        stripeProvider.setPublishableKey('pk_test_p8LvGghVcp3OacSGCX8g6sYI');
    })
    .filter('capitalize', function() {
        return function(input, all) {
            var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
            return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
        }
    });

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
        .when('/empresa/pagamento', {
            templateUrl: '/templates/pagamento.html',
            controller: 'PagamentoCtrl'
        })
        .when('/empresa/perfil', {
            templateUrl: '/templates/perfil.html',
            controller: 'EmpresaCtrl'
        })
        .when('/empresa/editar', {
            templateUrl: '/templates/editarEmpresa.html',
            controller: 'EmpresaCtrl'
        })
        .otherwise({
            redirectTo: '/empresa/dashboard'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}
