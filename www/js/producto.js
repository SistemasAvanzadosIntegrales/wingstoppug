$(document).ready(function(){
     /*if(pughpharm.isLogged()){
                
            } else{
                window.location = "index.html"
            }*/
    cargarProducto(); 
});

function cargarProducto(){
    $.ajax({
            method: 'POST',
            url: ruta + 'verproducto',
            data: {
                producto: localStorage['producto']
            },
            processData: true,
            dataType: "json",
            success: function (data) {
                $('#nombre').html(data.nombre);
                $('#descripcion').html(data.descripcion);
                $('#precio').html(data.precio);
                document.getElementById('imagen').src = ruta_imagen + data.imagen;
            },error: function (data){
                alert(JSON.stringify(data)+"  error");
            }
    });
}

function agregarCarrito(){
  
    var aux;
    var texto = document.getElementById('nombre').innerHTML;
    var valor = document.getElementById('precio').innerHTML;
    valor = valor.replace("$","");
    var img = document.getElementById('imagen').src;
    var des = document.getElementById('descripcion').innerHTML;
    var cant = $("#cantidad").val();
    //alert(localStorage['carrito']);
   
    if(localStorage['carrito']){
        aux =  JSON.parse(localStorage['carrito']);
        var productos = JSON.parse(localStorage['carrito']);
        var apuntador = -1;
        for(var i= 0; i < productos.length; i++){
            if(productos[i].id == localStorage["producto"])
                apuntador=i;
        }
        if(apuntador >= 0){
            aux[apuntador].cantidad = parseInt(aux[apuntador].cantidad) + parseInt(cant);
        }else{
            aux.push({id:localStorage["producto"], nombre: texto , precio:valor, imagen: img, descripcion : des, cantidad:cant,precioUnitario:valor,idCategoria:"0",categoria:"",idSubcategoria:"0",subcategoria:""});
        }
        
    }else{
        aux = [{id:localStorage["producto"], nombre: texto , precio:valor, imagen: img, descripcion : des, cantidad:cant, precioUnitario:valor, idCategoria:"0", categoria:"", idSubcategoria:"0", subcategoria:""}];
    }
    
    localStorage['carrito'] = JSON.stringify(aux);
    window.location = "pedido_producto.html";
}