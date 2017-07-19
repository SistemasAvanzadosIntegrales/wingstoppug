$(document).ready(function(){
    categorias();
    $("#cat").change(function(){
        subcategorias($('#cat').val());
    });
    $("#subcat").change(function(){
        productos($('#subcat').val());
    });
    
     $.ajax({
            method: 'POST',
            url: ruta + 'default',
            processData: true,
            dataType: "json",
            success: function (data) {
                $('.elim').remove();
                 for(var i = 0; i< data.id.length; i++){
                     $("#contenedor").append('<a class="elim" onclick="verproducto('+data.id[i]+')"><label class="text-azul"><h3><b>'+data.nombre[i]+'</b></h3></label>'+
                                                '<div class="imgCatego"><img src="'+ruta_imagen+data.imagen[i]+'">'+
                                                    '<div class="sombra"><img src="img/imgSombraHorizontal.png"/></div></div>'+
                                                        '</a>');
                 }
            },error: function (data){
                alert(JSON.stringify(data)+"  error");
            }
        });
    
    
    
});
    
function categorias(){
      $.ajax({
            url: ruta + 'categorias',
            processData: true,
            dataType: "json",
            success: function (data) {
               for(var i = 0; i< data.id.length; i++){
                     $("#cat").append('<option value="'+data.id[i]+'" >'+data.nombre[i]+'</option>');
                }
            },error: function (data){
                alert(JSON.stringify(data)+"  error");
            }
        });
}

function subcategorias(cat){
      $.ajax({
            method: 'POST',
            url: ruta + 'subcategorias',
            data: {
                categoria: cat
            },
            processData: true,
            dataType: "json",
            success: function (data) {
                //alert(JSON.stringify(data));
                 $("#subcat").empty();
                 $("#subcat").append('<option value="0" >Seleccione</option>');
                 for(var i = 0; i< data.id.length; i++){
                     $("#subcat").append('<option value="'+data.id[i]+'" >'+data.nombre[i]+'</option>');
                 }
            },error: function (data){
                alert(JSON.stringify(data)+"  error");
            }
        });
}

function productos(subcat){
      $.ajax({
            method: 'POST',
            url: ruta + 'productos',
            data: {
                subcategoria: subcat
            },
            processData: true,
            dataType: "json",
            success: function (data) {
                $('.elim').remove();
                 for(var i = 0; i< data.id.length; i++){
                     $("#contenedor").append('<a class="elim" onclick="verproducto('+data.id[i]+')"><label class="text-azul"><h3><b>'+data.nombre[i]+'</b></h3></label>'+
                                                '<div class="imgCatego"><img src="'+ruta_imagen+data.imagen[i]+'">'+
                                                    '<div class="sombra"><img src="img/imgSombraHorizontal.png"/></div></div>'+
                                                        '</a>');
                 }
            },error: function (data){
                alert(JSON.stringify(data)+"  error");
            }
        });
}  

function verproducto(id){
    localStorage["producto"] = id;
    window.location = "verproducto.html";
}

function regresar(){
    if(!pughpharm.isLogged){
        window.location = "categoriaProductos.html";
    }else{
        window.location = "index.html";
    }
}