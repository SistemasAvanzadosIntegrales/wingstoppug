function mostrarCuponesVertical(){
   $.ajax({
        url:ruta_generica,
        type: 'POST',
        data:
        {
            funcion:'cuponesSucursalQrSimple',
            idCliente: cliente
        },
        success:function(resp)
        { 
            //alert(resp);
            resp=JSON.parse(resp);
            //$("#contenedorPromociones").html(JSON.stringify(resp));
            jQuery.each(resp, function(i, val) {
                  alert(pughpharm.isLogged());
                  if(val.imagen!='')
                    $("#contenedorPromociones").append("<div class='inline imgPromos'><img onclick=\"modal('CP|"+val.codigoQR+"','"+val.imagen+"','"+resp[i].nombre+"','"+resp[i].descripcion+"')\" src='"+val.imagen+"'>"
                    +(pughpharm.isLogged()
                        ?"<div class='sombra' style='position:relative; top:-25px;'><img src='img/imgSombraHorizontal.png'/></div>"
                        :"<div class='sombra'><img src='img/imgSombraHorizontal.png'/></div>"
                    )+"</div>");
            });
            
            
        }
    }); 
}//function

function mostrarCuponesHorizontal(){
   $.ajax({
        url: ruta_generica,
        type: 'POST',
        data:{
            funcion:'cuponesSucursalQrSimple',
            idCliente: cliente
        },
        success:function(resp){ 
            //alert(pughpharm.isLogged());
            resp=JSON.parse(resp);
            var cupo="<table border='0' width='97%'>";            
            for(var i=0; i<=resp.length-1; i++){
                if(resp[i].imagen!='' && resp[i].paraMapa=='1')
                    cupo+="<tr><td><div class='inline imgPromos'><img onclick=\"modal('CP|"+resp[i].codigoQR+"','"+resp[i].imagen+"','"+resp[i].nombre+"','"+resp[i].descripcion+"')\" src='"+resp[i].imagen+"'>"
                    +(pughpharm.isLogged()
                        ?"<div class='sombra' style='position:relative; top:0px;'><img src='img/imgSombraHorizontal.png'/></div>"
                        :"<div class='sombra'><img src='img/imgSombraHorizontal.png'/></div>"
                    )+"</div></td></tr>";
            }//for
            cupo+="</table>";
            $("#contenedorPromociones").html(cupo);
        }//function
    }); 
}//function
