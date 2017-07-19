$(document).ready(function(){
       ver_carrito();
});

function ver_carrito(){
    var d = document.getElementById('productos_carrito');
    while(d.hasChildNodes())
        d.removeChild(d.firstChild);
    
    var confApp=JSON.parse(localStorage.getItem('configuracionApp'));
     var productos = JSON.parse(localStorage['carrito']);
        for(var i= 0; i < productos.length; i++){
            $('#productos_carrito').append('<span onclick="eliminar_producto('+i+')" class="fa fa-times-circle pull-right" style="font-size:28px;"></span></a>'+
                                            '<center><a href="#"><li>'+
                                                '<figure class="img-pedido inline"><img src="'+productos[i].imagen+'"></figure><br>'+
                                                    '<div class="descripcion inline">'+
                                                        '<h2 class="bullet text-azul" style="color:rgb('+confApp.colorBoton+');">('+productos[i].cantidad+')'+productos[i].nombre+'</h2>'+
                                                            '<p class="text-gris">'+productos[i].descripcion+'</p>'+
                                                    '</div></li></center><hr />');
        }
}

function eliminar_producto(indice){
    var carrito = JSON.parse(localStorage['carrito']);
    carrito.splice(indice,1);
    //alert(JSON.stringify(carrito));
    localStorage['carrito'] = JSON.stringify(carrito);
    ver_carrito();
    ver_puntos();
}