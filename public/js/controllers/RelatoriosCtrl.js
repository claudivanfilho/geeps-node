angular.module("Geeps")
    .controller('RelatoriosCtrl', RelatoriosController);

RelatoriosController.$inject = ['$scope', 'Pedidos'];

function RelatoriosController($scope, Pedidos) {

    $scope.pedService = Pedidos;
    if(Pedidos.pedidos.length == 0) {
        Pedidos.refresh();
    }

    var pedidos_concluidos = [];
    $scope.pedService.pedidos.forEach(function(obj) {
        if (obj.status === "CONCLUÍDO") {
            pedidos_concluidos.push(obj);
        }
    });

    var mapBairros = new Map();
    $scope.pedService.dados = [];

    var mapDatas = new Map();
    $scope.pedService.datasDosPedidos = new Array();

    pedidos_concluidos.forEach(function(obj) {

        // ---------------------------
        // Gráfico utilizando bairro - cidade
        // ---------------------------
        if (mapBairros.get(obj.endereco_entrega.bairro + ' - ' + obj.endereco_entrega.cidade)) {
            var cont = mapBairros.get(obj.endereco_entrega.bairro + ' - ' + obj.endereco_entrega.cidade);
            mapBairros.delete(obj.endereco_entrega.bairro);
            mapBairros.set(obj.endereco_entrega.bairro + ' - ' + obj.endereco_entrega.cidade, cont + 1);
        } else {
            mapBairros.set((obj.endereco_entrega.bairro + ' - ' + obj.endereco_entrega.cidade), 1);
        }

        // ---------------------------
        // Gráfico utilizando data de criação do pedido
        // ---------------------------
        var tempDate = (new Date(obj.data_criacao.toString().substring(0, 10))).toString();
        if (mapDatas.get(tempDate)) {
            var cont = mapDatas.get(tempDate);
            mapDatas.delete(tempDate);
            mapDatas.set(tempDate, cont + 1);
        } else {
            mapDatas.set(tempDate, 1);
        }
    });

    // -----------------------------------------------
    // Criando dados para colocar no gráfico de pizza
    // -----------------------------------------------
    mapBairros.forEach(function(value, key, mapObj) {
        $scope.pedService.dados.push([key, value]);
    });

    $scope.$parent.fixSideMenu();

}
