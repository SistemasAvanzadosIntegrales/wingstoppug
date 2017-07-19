function esEmail(email)
{
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function registrar()
{
    alert("Entro");
    /*if($("#nombre").val().trim()=='')
    {
        $("#alertaRegistro").html("Debes escribir tu nombre").show();
    }*/
    if($("#numero_tarjeta").val().trim()=="")
    {
        $("#alertaRegistro").html("Debes escribir tú número de tarjeta").show();
    }
    else if(!parseInt($("#numero_tarjeta").val().trim()))
    {
        $("#alertaRegistro").html("El número de tarjeta solo debe contener números").show();
    }
    /*else if($("#fecha_nac").val().trim()=='')
    {
        $("#alertaRegistro").html("Debes escribir tu fecha de nacimiento").show();
    }
    else if($("#sexo").val().trim()==0)
    {
        $("#alertaRegistro").html("Debes seleccionar el sexo").show();
    }*/
    else if($("#email").val().trim()=='')
    {
        $("#alertaRegistro").html("Debes escribir tu email").show();
    }
    else if(!esEmail($("#email").val().trim()))
    {
        $("#alertaRegistro").html("Debes escribir un email válido").show();
    }
    else if($("#telefono").val().trim()=='')
    {
        $("#alertaRegistro").html("Debes esribir tu teléfono").show();
    }
    else if($("#idEstado").val().trim()==0)
    {
        $("#alertaRegistro").html("Debes seleccionar un estado").show();
    }
    else if($("#idMunicipio").val().trim()==0)
    {
        $("#alertaRegistro").html("Debes seleccionar un municipio").show();
    }
    else if($("#colonia").val().trim()=='')
    {
        $("#alertaRegistro").html("Debes escribir tu colonia").show();
    }
    else if($("#cp").val().trim()=='')
    {
        $("#alertaRegistro").html("Debes escribir tu código postal").show();
    }
    else if(!parseInt($("#cp").val().trim()))
    {
        $("#alertaRegistro").html("El código postal solo puede contener números").show();
    }
    else
    {
        $("#alertaRegistro").html("").hide();
        
        $.ajax({
            url:"http://chai.lealtadprimero.com.mx/servicio/index.php",
            type: 'POST',
            data:
            {
                funcion:'registro',
                numeroTarjeta:$("#numero_tarjeta").val().trim(), 
                email:$("#email").val().trim(), 
                telefono:$("#telefono").val().trim(), 
                idEstado:$("#idEstado").val(), 
                idMunicipio:$("#idMunicipio").val(), 
                colonia:$("#colonia").val().trim(), 
                cp:$("#cp").val().trim(), 
                estaDeacuerdo:$("#estaDeacuerdo").val().trim()
            },
            success:function(resp)
            { 
                resp=JSON.parse(resp);
                if(resp.error=='')
                {
                    location.href='usuarioLealtad.html';
                }
                else
                {
                    $("#alertaRegistro").html(resp.error).show();
                }
            }
        });
        
    }
}

var cadMunicipios='<option value="0">Elija un municipio</option>';
function cargaMunicipios()
{
    if($("#idEstado").val().trim()>0)
    {
        $.ajax({
            url:"http://chai.lealtadprimero.com.mx/servicio/index.php",
            type: 'POST',
            data:
            {
                funcion:'municipios',
                idEstado:$("#idEstado").val().trim()
            },
            success:function(resp)
            { 

                resp=JSON.parse(resp);
                cadMunicipios='<option value="0">Elija un municipio</option>';
                jQuery.each(resp, function(i, val) {
                  cadMunicipios+='<option value="'+val.id+'">'+val.nombre+'</option>';
                });
                $("#idMunicipio").html(cadMunicipios);
            }
        });
    }
    else
    {
        $("#idMunicipio").html(cadMunicipios);
    }
    
}

var cadEstados='<option value="0">Elija un estado</option>';

$(document).ready(function(){
    $.ajax({
        url:"http://chai.lealtadprimero.com.mx/servicio/index.php",
        type: 'POST',
        data:
        {
            funcion:'estados'
        },
        success:function(resp)
        { 
            
            resp=JSON.parse(resp);
            
            jQuery.each(resp, function(i, val) {
              cadEstados+='<option value="'+val.id+'">'+val.nombre+'</option>';
            });
            $("#idEstado").html(cadEstados);
        }
    });
});