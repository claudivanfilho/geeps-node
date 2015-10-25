angular.module("Geeps")
    .controller('BaseCtrl', BaseController);

BaseController.$inject = ['$scope', '$http', 'Empresa'];

function BaseController($scope, $http, Empresa) {

    $scope.logout = logout;

    $scope.empService = Empresa;
    Empresa.refresh();

    function logout() {
        $http.get('/empresa/logout')
            .success(function(data) {
                window.location.href = '/auth/login';
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

    $scope.fixSideMenu = function() {
        var elements = document.getElementById("sideBar");
        var lines = elements.getElementsByTagName('a');
        for(var i = 0;i<lines.length; i++) {
            if (lines[i].getAttribute('href') != window.location.pathname) {
                elements.getElementsByTagName('a')[i].removeAttribute("class");
            }
        }
        console.log(window.location.pathname);
    }
}
