angular.module("Geeps", [
    'ngRoute', 'googlechart', 'chart.js', 'ui.bootstrap',
    'angular-stripe', 'angular-loading-bar', 'angucomplete-alt'])
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
        .when('/empresa/pagamento', {
            templateUrl: '/templates/pagamento.html',
            controller: 'PagamentoCtrl'
        })
        .otherwise({
            redirectTo: '/empresa/pagamento'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}
