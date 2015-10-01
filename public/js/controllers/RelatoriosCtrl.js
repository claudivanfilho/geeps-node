angular.module("Geeps")
    .controller('RelatoriosCtrl', ['Pedidos', RelatoriosController]);

RelatoriosController.$inject = ['$scope'];

function RelatoriosController($scope, Pedidos) {

    var pedidos_concluidos = [];
    $scope.pedidos.forEach(function(obj) {
        if (obj.status === "CONCLUÍDO") {
            pedidos_concluidos.push(obj);
        }
    });

    var mapBairros = new Map();
    $scope.dados = [];

    var mapDatas = new Map();
    $scope.datasDosPedidos = new Array();

    $scope.initData = function() {
        console.log("initData entrou");
        
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
            $scope.dados.push([key, value]);
        });

        // -----------------------------------------------
        // Criando dados para colocar no gráfico das datas
        // -----------------------------------------------
        mapDatas.forEach(function(value, key, mapObj) {
            $scope.datasDosPedidos.push([new Date(key.toString().substring(0, 15)), value]);
        });
    }

}
