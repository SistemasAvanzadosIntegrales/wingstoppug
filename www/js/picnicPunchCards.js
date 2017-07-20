var enviarVentas=false;
function loginRealm()
{
    if(arguments.length>=1)
        enviarVentas=true;
    var registro = JSON.parse(localStorage.getItem('pughpharm'));
    snog_dispatcher.broadcast(Snog.events.REALM_LOGIN, {token: registro.codigo, realm:"easier_loyalty"});
}

function takeItemFromBatch(item, batch)
{
    snog_dispatcher.broadcast(Snog.events.TAKE_ITEM_FROM_BATCH, {batch_uuid:batch, item_instance_uuid:item});
}

function swapItem(f_bag_id, f_slot_id,f_item_instance_uuid,t_bag_id,t_slot_id,t_item_instance_uuid)
{
    snog_dispatcher.broadcast(Snog.events.SWAP_ITEM_INSTANCES, { from_bag_id:f_bag_id, from_slot_id:f_slot_id, from_item_instance_uuid:f_item_instance_uuid, to_bag_id:t_bag_id, to_slot_id:t_slot_id, to_item_instance_uuid:t_item_instance_uuid});
}



function getBoardInstances()
{
    snog_dispatcher.broadcast(Snog.events.GET_BOARDS_INSTANCES, {type:'special', player_id:parseInt(localStorage.getItem('player_id')) });
}




function getBagInstance(board,slot,nslots)
{
    var cad='';
    $('#board_'+board).html('');
    for(var iPunch=0; iPunch<nslots; iPunch++)
    {
        cad+='<img id="slot'+iPunch+'" width="20px" img src="'+slot+'" style="margin: 3px 5px" />';
    }
    $('#board_'+board).html(cad);

    snog_dispatcher.broadcast(Snog.events.LOAD_BOARD_INSTANCE_BAG, { board_instance_id:parseInt(board) });
}

function getItemsPlayerInventory()
{
    snog_dispatcher.broadcast(Snog.events.GET_PLAYER_INVENTORY);
}

var boards={};

$(document).ready(function()
{
    bag=null;
    player=0;
    batchUid=null;
    boardRef=null;
    boards[boardRef]=0;
    bagInstance=null;
    // Initialize Snog engine;
    Snog.all();
    Snog.debug = true;

    snog_data = Snog.require('data');
    snog_dispatcher = Snog.require('dispatcher');
    snog_widget = Snog.require('widget');
    snog_facebook = Snog.require('facebook');
    new_batch_flag=true;

    

    snog_dispatcher.on(Snog.events.LOGIN_SUCCESS, function (data) 
    {
        player=data.player_id;
        //Guardamos en el local storage los datos de referencia a PICNIC
        localStorage.setItem('player_id',data.player_id);
        localStorage.setItem('auth_token',data.auth_token);
        getItemsPlayerInventory();
        snog_dispatcher.broadcast(Snog.events.GET_BOARDS_LIST, {type : "special", filter : "all"});
        if(enviarVentas)
        {
            $.ajax({
                method: 'POST',
                url: ruta_generica,
                data: {
                    funcion:'transaccionesPendientesAPicnic',
                    idCliente:cliente,
                    numeroTarjeta:localStorage['tarjeta'],
                    playerId: localStorage.getItem('player_id')

                },
                processData: true,
                dataType: "json",
                success: function(data)
                {
                    
                },error: function (data){
                    //alert("error picnipendientes "+JSON.stringify(data));
                }
            }); 
            
        }
        
            
        
    });
    
    snog_dispatcher.on(Snog.events.GET_BOARDS_LIST_SUCCESS, function (data, id) 
    {
        var contador=0;
        jQuery.each(data, function(i, val) 
        {
            boards[val.board_ref]=null;
            boards[val.board_ref]['slot']=0;
            contador++;
            //Si el contador es mayor o igual que la lista de punchcards entonces podemos estar
            //seguros de que las recorrimos todas y entonce ahora buscamos las punch card del player
            /*if(contador>=data.length)
            {
                console.log(boards);
                snog_dispatcher.broadcast(Snog.events.GET_BOARDS_INSTANCES, {type:'special', player_id:player });
            }*/
        });
    });

    snog_dispatcher.on(Snog.events.GET_BOARDS_INSTANCES_SUCCESS, function (data) 
    {
        contadorBoardInstances=0;
        

        $("#contenedorBoardInstances").html('');
        jQuery.each(data, function(i, val) 
        {
            contadorBoardInstances++;
            if(val.empty===false)
            {
                boards[val.board_instance.board_ref]=val.board_instance;
                boards[val.board_instance.board_ref]['slot']=0;
                var assetsProcessed = 0;
                var assetPrevio='https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
                var assetCover='';
                var assetSlot='';
                jQuery.each(val.board_instance.assets, function(i, asset) 
                {  
                    assetsProcessed++;
                    if(asset.kind=='preview')
                        assetPrevio=asset.uri;
                    if(asset.kind=='cover')
                        assetCover=asset.uri;
                    if(asset.kind=='slot')
                        assetSlot=asset.uri;
                    if(assetsProcessed===val.board_instance.assets.length)
                    {
                        var cad='<div style="margin-top:60px" class="objetivosMision width100 inline"><img width="100%" src="'+assetPrevio+'" class="img-icono"><div id="board_'+val.board_instance.board_instance_id+'" style="background-color:#fff; height:60px; width:100%; position: relative; top:-60px;">';
                        cad+='</div></div>';
                        $(cad).appendTo("#contenedorBoardInstances");
                        getBagInstance(val.board_instance.board_instance_id,assetSlot,val.board_instance.size);
                    }
                });
            }


            
            if(contadorBoardInstances>=data.length)
            {
                jQuery.each(boards, function(i, val) 
                {
                    if(val==null && i!='undefined')
                    {
                        boards[i]=i;
                        snog_dispatcher.broadcast(Snog.events.CREATE_BOARD_INSTANCE, {board_ref: i });
                    }
                    
                        
                });
            }

        });
        
        
    });
    
    snog_dispatcher.on(Snog.events.CREATE_BOARD_INSTANCE_SUCCESS, function (data) 
    {
        boards[data.board_ref]=data;
        boards[data.board_ref]['slot']=0;
        snog_dispatcher.broadcast(Snog.events.GET_BOARDS_INSTANCES, {type:'special', player_id:player });

    });
    
    snog_dispatcher.on(Snog.events.LOAD_BOARD_INSTANCE_BAG_SUCCESS, function (data) 
    {
        //Mostramos un dialogo con la información
        var slotActual=0;
        boards[boardRef]['slot']=slotActual;
        jQuery.each(data.bag_items, function(i, val) 
        {
            slotActual++;
            boards[val.item_instance.metadata[1].value]['slot']=slotActual;
            $("#slot"+val.slot_id).attr('src', val.item_instance.assets[0].uri);
        });
        if(data.bag_items.length==data.size)
            $('<input type="button" class="btn btn-success" value="Obtener cupón" onclick="obtenerCupon('+data.bag_items[0].item_instance.metadata[0].value+');"/>').appendTo('#contenedorBoardInstances');   
    });


    snog_dispatcher.on(Snog.events.NOTIFICATION, function(data)
    {
        
        if (data.kind && data.kind==="new_batch" && data.batch_uuid)
        {                   
            batchUid=data.batch_uuid;
            snog_dispatcher.broadcast(Snog.events.GET_ITEM_BATCH, {batch_uuid: data.batch_uuid});
        }
    });
    
    snog_dispatcher.on(Snog.events.GET_ITEM_BATCH_SUCCESS, function(data)
    {
        jQuery.each(data.item_instances, function(i, val) 
        {
            boardRef=val.metadata[1].value;
            snog_dispatcher.broadcast(Snog.events.TAKE_ITEM_FROM_BATCH, {batch_uuid:batchUid, item_instance_uuid:val.item_instance_uuid});
        });
    });

    snog_dispatcher.on(Snog.events.TAKE_ITEM_FROM_BATCH_SUCCESS, function (data) 
    {
        getItemsPlayerInventory();
    });



    snog_dispatcher.on(Snog.events.GET_PLAYER_INVENTORY_SUCCESS, function () 
    {
        jQuery.each(snog_data.player_inventory.slots, function(i, val) 
        {
            if(val.item_instance!=null)
            {   
                swapItem(snog_data.player_inventory.bag_id,val.slot_id, val.item_instance.item_instance_uuid,boards[boardRef].bag_id,boards[val.item_instance.metadata[1].value]['slot'],null);
                snog_dispatcher.broadcast(Snog.events.GET_BOARDS_INSTANCES, {type:'special', player_id:player });
            }
        });
    });

    

    /*snog_dispatcher.on(Snog.events.ITEM_INSTANCES_SWAPPED, function(data){
        alert("swaped");
        snog_dispatcher.broadcast(Snog.events.GET_BOARDS_INSTANCES, {type:'special', player_id:player });
    });*/

    

});
