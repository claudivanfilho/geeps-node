angular.module("Geeps")
    .controller('ModalCardCtrl', ModalCardController);

ModalCardController.$inject = ['$scope', '$modalInstance', 'stripe', '$http', 'plano', 'plans'];

function ModalCardController($scope, $modalInstance, stripe, $http, plano, plans) {

    $scope.plano = plano;
    $scope.plans = plans;
    $scope.plandata = {};

    $scope.plandata.plan = plano.id;

    $scope.setPlan = function() {
        try {
            stripe.card.createToken($scope.plancard) // primeiro token
                .then(function (response) {
                    console.log('token created for card ending in ', response.card.last4);
                    var billdata = {};
                    billdata.stripeToken = response.id;
                    $http.post('/billing', billdata) // set the card
                        .success(function(data) {
                            stripe.card.createToken($scope.plancard) // segundo token
                                .then(function (response) {
                                    $scope.plandata.stripeToken = response.id;
                                    if (Object.keys($scope.plandata).length != 0) {
                                        $http.post('/plan', $scope.plandata)  // set the plan
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
                        })
                        .error(function(data) {
                            alert(data);
                        });
                });
        } catch(reason) {
            alert(reason);
        }
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
}
