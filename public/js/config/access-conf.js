angular.module("GeepsAccess", ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', configGeeps])
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

function configGeeps($routeProvider, $locationProvider) {

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

