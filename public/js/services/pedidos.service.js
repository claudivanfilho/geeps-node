angular
    .module('Geeps')
    .service('Pedidos', pedidosService);

pedidosService.$inject = ['$http'];

function pedidosService($http) {

    var Service = {};
    Service.pedidos = [];
    Service.refresh = refresh;
    Service.setSelected = setSelected;
    Service.refreshAndSet = refreshAndSet;
    Service.cadastrar = cadastrar;
    Service.excluir = excluir;
    Service.setStatus = setStatus;
    Service.editar = editar;
    Service.selected = {};

    return Service;

    function refresh() {
        $http.get('/api/pedidos')
            .success(function(data) {
                console.log(data);
                Service.pedidos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

    function setSelected(id) {
        for (var i=0; i < Service.pedidos.length; i++) {
            if (Service.pedidos[i]._id == id)
                Service.selected = Service.pedidos[i];
        }
    }

    function refreshAndSet(id) {
        $http.get('/api/pedidos')
            .success(function(data) {
                Service.pedidos = data;
                setSelected(id);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

    function cadastrar(data) {
        $http.post('/empresa/pedido', data)
            .success(function(data) {
                var result = confirm(data.title);
                if(result) {
                    window.location.href = '/empresa/dashboard';
                }
            })
            .error(function(data) {
                alert(data.message);
            });
    }

    function excluir(data) {
        $http.post('/empresa/pedido/excluir', data)
            .success(function(data) {
                var result = confirm(data);
                if(result) {
                    window.location.href = '/empresa/pedidos';
                }
            })
            .error(function(data) {
                alert(data);
            });
    }

    function setStatus(data) {
        $http.post('/empresa/pedido/setstatus', data)
            .success(function(data) {
                var result = confirm(data);
                if(result) {
                    window.location.href = '/empresa/pedidos';
                }
            })
            .error(function(data) {
                alert(data);
            });
    }

    function editar(data) {
        $http.post('/empresa/pedido/editar', data)
            .success(function(data) {
                var result = confirm(data);
                if(result) {
                    window.location.href = '/empresa/pedidos';
                }
            })
            .error(function(data) {
                console.log(data);
                alert(data);
            });
    }
}
