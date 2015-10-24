angular.module("Geeps")
    .controller('PagamentoCtrl', PagamentoController);

PagamentoController.$inject = ['$scope', 'stripe', 'Empresa'];

function PagamentoController($scope, stripe, Empresa) {

    $scope.$parent.fixSideMenu();

    $scope.empService = Empresa;
    Empresa.refresh();

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
            stripe.card.createToken($scope.cardplan)
                .then(function (response) {
                    console.log('token created for card ending in ', response.card.last4);
                    alert(response.id); // stripe token
                    //return $http.post('https://yourserver.com/payments', payment);
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
                    alert(response.id); // stripe token
                    //return $http.post('https://yourserver.com/payments', payment);
                });
        } catch(reason) {
            alert(reason);
        }
    }
}
