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
            name : 'basic',
            price : 75
        },
        {
            name : 'normal',
            price : 125
        },
        {
            name : 'advanced',
            price : 150
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
                                alert(data);
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
