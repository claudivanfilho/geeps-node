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
        if (obj.status === "CONCLUÍDO" || obj.status === "CONCLUIDO") {
            pedidos_concluidos.push(obj);
        }
    });

    var mapBairros = new Map();
    var mapDatas = new Map();
    // $scope.pedService.datasDosPedidos = new Array();

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
    var bairros = [];
    mapBairros.forEach(function(value, key, mapObj) {
        bairros.push({c: [{v: key},{v: value},]});
    });

    $scope.chartObject = {};
    $scope.chartObject.type = "PieChart";
    $scope.chartObject.data = {"cols": [
        {id: "t", label: "Topping", type: "string"},
        {id: "s", label: "Slices", type: "number"}
    ], "rows": bairros};
    

    // -----------------------------------------------
    // Criando dados para colocar no gráfico das datas (Por mês)
    // -----------------------------------------------
    var datasDosPedidos = new Array();
    mapDatas.forEach(function (value, key) {
        datasDosPedidos.push([new Date(key.toString().substring(0, 15)), value]);
    });  
 
    $scope.labels = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    var months = [];

    for(var i = 0; i < $scope.labels.length; i++) {
        months.push(0);
    } 

    mapDatas.forEach(function (value, key){        
        var tempDate = new Date(key);
        months[tempDate.getMonth()] = value;
    });

    $scope.series = ['Vendas'];
    $scope.data = [
        months
    ];

    $scope.$parent.fixSideMenu();

}
