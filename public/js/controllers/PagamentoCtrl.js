angular.module("Geeps")
    .controller('PagamentoCtrl', PagamentoController);

PagamentoController.$inject = ['$scope'];

function PagamentoController($scope) {

    $scope.$parent.fixSideMenu();

}
