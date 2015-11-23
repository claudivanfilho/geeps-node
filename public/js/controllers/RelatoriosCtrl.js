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
    var mapDatasPorBairro = new Map();
    // $scope.pedService.datasDosPedidos = new Array();

    pedidos_concluidos.forEach(function(obj) {

        // ---------------------------
        // Gráfico utilizando bairro - cidade
        // ---------------------------
        var tempBairro = obj.endereco_entrega.bairro + ' - ' + obj.endereco_entrega.cidade;
        if (mapBairros.get(tempBairro)) {
            var cont = mapBairros.get(tempBairro);
            mapBairros.delete(tempBairro);
            mapBairros.set(tempBairro, cont + 1);
        } else {
            mapBairros.set(tempBairro, 1);
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

        // ---------------------------
        // Gráfico utilizando data de criação do pedido agrupadas por bairro
        // ---------------------------
        if (mapDatasPorBairro.get(tempBairro)) {
            var tempMap = mapDatasPorBairro.get(tempBairro);
            if (tempMap.get(tempDate)) {
                var cont = tempMap.get(tempDate);
                tempMap.delete(tempDate);
                tempMap.set(tempDate, cont + 1);
            } else {
                tempMap.set(tempDate, 1);
            }
        } else {
            mapDatasPorBairro.set(tempBairro, new Map());
            mapDatasPorBairro.get(tempBairro).set(tempDate, 1);
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

    $scope.data = [
        months
    ];


    // -----------------------------------------------
    // Criando dados para colocar no gráfico das datas agrupadas por bairro
    // -----------------------------------------------

    months = [];
    for(var i = 0; i < $scope.labels.length; i++) {
        months.push(0);
    }

    $scope.series = [];
    console.log(mapDatasPorBairro);
    mapDatasPorBairro.forEach(function(value, key) {
        $scope.series.push(key);
    });

    $scope.groups = [];
    for(var i = 0; i < $scope.series.length; i++) {

        var tempMonths = months.slice(0);
        mapDatasPorBairro.get($scope.series[i]).forEach(function (value, key){
            var tempDate = new Date(key);
            tempMonths[tempDate.getMonth()] = value;
        });
        $scope.groups.push(tempMonths);
    }



    $scope.$parent.fixSideMenu();

}
