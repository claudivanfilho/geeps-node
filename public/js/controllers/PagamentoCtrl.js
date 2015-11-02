angular.module("Geeps")
    .controller('PagamentoCtrl', PagamentoController);

PagamentoController.$inject = ['$scope', 'stripe', 'Empresa', '$http'];

function PagamentoController($scope, stripe, Empresa, $http) {

    $scope.$parent.fixSideMenu();

    $scope.empService = Empresa;
    Empresa.refresh();

    $scope.plandata = {};

    $scope.plans = [
        {
            id : 'economico',
            nome : 'Econômico',
            preco : 'R$ 75,00',
            recursos : [
                'Cadastro de Pedidos',
                'Cadastro de Entregadores'
            ]
        },
        {
            id : 'completo',
            nome : 'Completo',
            preco : 'R$ 125,00',
            recursos : [
                'Cadastro de Pedidos',
                'Cadastro de Entregadores',
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
                'Relatórios de Vendas',
                'Acompanhamento em Tempo Real dos Entregadores'
            ]
        }
    ];

    $scope.setPlan = function() {
        try {
            stripe.card.createToken($scope.plancard)
                .then(function (response) {
                    console.log('token created for card ending in ', response.card.last4);
                    $scope.plandata.stripeToken = response.id;
                    if (Object.keys($scope.plandata).length != 0 &&
                        $scope.plandata.plan != $scope.empService.empresa.stripe.plan) {

                        $http.post('/plan', $scope.plandata)
                            .success(function(data) {
                                var answer = confirm(data)
                                if (answer) {
                                    window.location.href = '/empresa/pagamento';
                                }
                            })
                            .error(function(data) {
                                alert(data);
                            });
                    }
                });

        } catch (reason) {
            alert(reason);
        }
    }

    $scope.setBill = function() {
        try {
            stripe.card.createToken($scope.cardbill)
                .then(function (response) {
                    console.log('token created for card ending in ', response.card.last4);
                    var billdata = {};
                    billdata.stripeToken = response.id;
                    $http.post('/billing', billdata)
                        .success(function(data) {
                            // window.location.href = '/empresa/dashboard';
                            alert(data);
                        })
                        .error(function(data) {
                            alert(data);
                        });
                });
        } catch(reason) {
            alert(reason);
        }
    }
}
