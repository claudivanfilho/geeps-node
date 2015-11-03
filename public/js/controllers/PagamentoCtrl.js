angular.module("Geeps")
    .controller('PagamentoCtrl', PagamentoController);

PagamentoController.$inject = ['$scope', 'Empresa', '$modal'];

function PagamentoController($scope, Empresa, $modal) {

    $scope.$parent.fixSideMenu();

    $scope.empService = Empresa;
    Empresa.refresh();

    $scope.plans = [
        {
            id : 'economico',
            nome : 'Econômico',
            preco : 'R$ 75,00',
            recursos : [
                'Cadastro de Pedidos',
                'Cadastro de Entregadores',
                'Acompanhamento do pedido via App Geeps'
            ]
        },
        {
            id : 'completo',
            nome : 'Completo',
            preco : 'R$ 150,00',
            recursos : [
                'Cadastro de Pedidos',
                'Cadastro de Entregadores',
                'Acompanhamento do pedido via App Geeps',
                'Relatórios de Vendas'
            ]
        },
        {
            id : 'master',
            nome : 'Master',
            preco : 'R$ 200,00',
            recursos : [
                'Cadastro de Pedidos',
                'Cadastro de Entregadores',
                'Acompanhamento do pedido via App Geeps',
                'Relatórios de Vendas',
                'Acompanhamento em Tempo Real dos Entregadores'
            ]
        }
    ];

    $scope.openCardModal = function(plano) {
        $modal.open({
            animation: true,
            templateUrl: '../templates/modal/credit_card.html',
            controller: 'ModalCardCtrl',
            resolve: {
                plano: function () {
                    return plano;
                },
                plans: function() {
                    return $scope.plans;
                }
            },
            size: undefined
        });
    }
}
