angular.module("Geeps")
    .controller('RelatoriosCtrl', RelatoriosController);

RelatoriosController.$inject = ['$scope'];

function RelatoriosController($scope) {

    // TODO ARRUMAR ISSO AQUI!!!
    /*
    google.load('visualization', '1.0', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.setOnLoadCallback(drawChart);

    google.load("visualization", "1.1", {packages:["calendar"]});

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');

        // Trabalhando com os dados do mongo.
        var mapBairros = new Map();
        var mapDatas = new Map();

        //{{#each pedidos}}
        // ---------------------------
        // Gráfico utilizando bairro - cidade
        // ---------------------------
        if(mapBairros.get('{{this.endereco_entrega.bairro}}' + ' - ' + '{{this.endereco_entrega.cidade}}')){
            var cont = mapBairros.get('{{this.endereco_entrega.bairro}}' + ' - ' + '{{this.endereco_entrega.cidade}}');
            mapBairros.delete('{{this.endereco_entrega.bairro}}');
            mapBairros.set('{{this.endereco_entrega.bairro}}' + ' - ' + '{{this.endereco_entrega.cidade}}', cont + 1);
        } else{
            mapBairros.set(('{{this.endereco_entrega.bairro}}' + ' - ' + '{{this.endereco_entrega.cidade}}'), 1);
        }

        // ---------------------------
        // Gráfico utilizando data de criação do pedido
        // ---------------------------
        var tempDate = (new Date('{{this.data_criacao}}'.toString().substring(0,15))).toString();
        if (mapDatas.get(tempDate)){
            var cont = mapDatas.get(tempDate);
            mapDatas.delete(tempDate);
            mapDatas.set(tempDate, cont + 1);
        } else {
            mapDatas.set(tempDate, 1);
        }
        //{{/each}}

        // -----------------------------------------------
        // Criando dados para colocar no gráfico de pizza
        // -----------------------------------------------
        var dados = [];
        mapBairros.forEach(function (value, key, mapObj) {
            dados.push([key, value]);
        });

        data.addRows(dados);

        // Set chart options
        var options = {'title':'Quais bairros mais vendem'};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);

        // -----------------------------------------------
        // Criando dados para colocar no gráfico das datas
        // -----------------------------------------------
        var datasDosPedidos = new Array();
        mapDatas.forEach(function (value, key, mapObj) {
            datasDosPedidos.push([new Date(key.toString().substring(0, 15)), value]);
        });

        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn({ type: 'date', id: 'Date' });
        dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
        dataTable.addRows(datasDosPedidos);

        var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

        var options = {
            title: "Vendas"
        };

        chart.draw(dataTable, options);
    }
     */
}
