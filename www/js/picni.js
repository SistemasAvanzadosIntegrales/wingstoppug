function loginRealm()
{
    snog_dispatcher.broadcast(Snog.events.REALM_LOGIN, {token: "cb6e21d4f679edf058be50c19ba3f340", realm:"easier_loyalty"});
}

function getItemsFromBatch()
{
    snog_dispatcher.broadcast(Snog.events.GET_ITEM_BATCH, {size:500, ttl:1500});
}

function getItemsPlayerInventory()
{
    snog_dispatcher.broadcast(Snog.events.GET_PLAYER_INVENTORY);
}

function getBoardInstances()
{
    alert(localStorage.getItem('player_id'));
    snog_dispatcher.broadcast(Snog.events.GET_BOARDS_INSTANCES, {type:'special', player_id:parseInt(localStorage.getItem('player_id')) });
}


function dropFromInventory(slot)
{
    snog_dispatcher.broadcast(Snog.events.DROP_INVENTORY_ITEM, { slot_id:slot });
}

function takeItemFromBatch(item, batch)
{
    snog_dispatcher.broadcast(Snog.events.TAKE_ITEM_FROM_BATCH, {batch_uuid:batch, item_instance_uuid:item});
}

function unlockBoard(board)
{
    snog_dispatcher.broadcast(Snog.events.UNLOCK_BOARD_INSTANCE, { board_instance_id:board });
}

function swapItem(f_bag_id, f_slot_id,f_item_instance_uuid,t_bag_id,t_slot_id,t_item_instance_uuid)
{
    snog_dispatcher.broadcast(Snog.events.SWAP_ITEM_INSTANCES, { from_bag_id:f_bag_id, from_slot_id:f_slot_id, from_item_instance_uuid:f_item_instance_uuid, to_bag_id:t_bag_id, to_slot_id:t_slot_id, to_item_instance_uuid:t_item_instance_uuid});
}

function getBoardInstance(board)
{
    snog_dispatcher.broadcast(Snog.events.GET_BOARD_INSTANCE_AND_BAG, {board_instance_id:parseInt(board), player_id:localStorage.getItem('player_id')});
}

function getBagInstance(board,title, cover, board_size, slot)
{
    $('.contenidoDetallePunchCard').html('');
    var tds="<tr>";
    var j=0;

    for(j=0; j<board_size;j++)
        tds+='<td id="slot'+j+'"><img width="60" src="'+slot+'" /></td>';

    tds+="</tr>";

    $('<table><tr><td colspan="'+board_size+'"><b>'+title+'</b></td></tr><tr><td colspan="'+board_size+'"><img width="100%" src="'+cover+'" /></td></tr>'+tds+'</table>').appendTo('.contenidoDetallePunchCard');


    snog_dispatcher.broadcast(Snog.events.LOAD_BOARD_INSTANCE_BAG, { board_instance_id:parseInt(board) });
}

function lockBoard(board)
{
    snog_dispatcher.broadcast(Snog.events.LOCK_BOARD_INSTANCE, { board_instance_id:parseInt(board) });
}

function getReward()
{
    snog_dispatcher.broadcast(Snog.events.GET_REWARD_INSTANCES,{player_id:localStorage.getItem('player_id')});

}

function getBoardList()
{
    snog_dispatcher.broadcast(Snog.events.GET_BOARDS_LIST, {type : "special", filter : "all"});
}



$(document).ready(function(){
    bag=null;
    boardInstance=null;
    // Initialize Snog engine;
    Snog.all();
    Snog.debug = false;

    snog_data = Snog.require('data');
    snog_dispatcher = Snog.require('dispatcher');
    new_batch_flag=true;



    snog_dispatcher.on(Snog.events.LOGIN_SUCCESS, function (data) 
    {
        //Guardamos en el local storage los datos de referencia a PICNIC
        localStorage.setItem('player_id',data.player_id);
        localStorage.setItem('auth_token',data.auth_token);

        
        //Ocultamos los botones
        $(".btnHidden").show();
        //Extraemos la lista de premios
        getBoardInstances();
        //snog_dispatcher.broadcast(Snog.events.GET_REWARD_INSTANCES, { player_id:localStorage.getItem('player_id') });
    });

    snog_dispatcher.on(Snog.events.GET_ITEM_BATCH_SUCCESS, function(data)
    {
        jQuery.each(data.item_instances, function(i, val) 
        {
            
            $( '<b>'+i+'</b><img title="'+val.item_ref+'" width="100" src="'+val.assets[0].uri+'" /><input type="button" value="Take" onclick="takeItemFromBatch(\''+val.item_instance_uuid+'\',\''+data.batch_uuid+'\');"/>' ).appendTo( "#batch" );

        });
    });

    snog_dispatcher.on(Snog.events. GET_ITEM_BATCH_ERROR, function(data){
        console.log("error getting batch");
        $("#batch").html('<p class="alert alert-danger">Error getting batch</p>');
    });

    snog_dispatcher.on(Snog.events.GET_PLAYER_INVENTORY_SUCCESS, function () 
    {
        
        console.log(snog_data.player_inventory);

        $("#inventory").html('');

        jQuery.each(snog_data.player_inventory.slots, function(i, val) 
        {
            /*if(val.item_instance.metadata=='')
            {

            }
            else
            {
                $( '<b>'+i+'</b><img width="100" src="'+val.item_instance.assets[0].uri+'" />' ).appendTo( "#inventory" );
            }*/
            //console.log(val);
            
            if(val.item_instance!=null)
                $( '<b>'+i+'</b><img width="100" title="'+val.item_instance.item_ref+'" src="'+val.item_instance.assets[0].uri+'" /><input type="button" onclick="dropFromInventory('+val.slot_id+');" value="Drop"><input type="button" onclick="swapItem('+snog_data.player_inventory.bag_id+','+val.slot_id+', \''+val.item_instance.item_instance_uuid+'\',23,5,'+null+');" value="Swap">' ).appendTo( "#inventory" );
            

            
        });
    });

    snog_dispatcher.on(Snog.events.GET_BOARDS_INSTANCES_SUCCESS, function (data) 
    {
        $("#contenedorBoardInstances").html('');
        jQuery.each(data, function(i, val) 
        {   
            if(val.empty===false)
            {
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
                        var cad='<div class="objetivosMision inline"><p class="avance text-azul">0/'+val.board_instance.size+'</p><img width="100" src="'+assetPrevio+'" class="img-icono" onclick="getBagInstance('+val.board_instance.board_instance_id+',\''+val.board_instance.title+'\',\''+assetCover+'\','+val.board_instance.size+',\''+assetSlot+'\');";><p>'+val.board_instance.title+'</p></div>';
                        $(cad).appendTo("#contenedorBoardInstances");
                    }
                    
                });
            }
        });
        /*jQuery.each(data, function(i, val) 
        {
            //console.log(val.empty);
            if(val.empty===false)
            {
                //console.log(val);
                var tds="<tr>";
                var j=0;

                for(j=0; j<val.board_instance.size;j++)
                    tds+='<td id="slot'+j+'"><img width="60" src="'+val.board_instance.assets[1].uri+'" /></td>';

                tds+="</tr>";

                $('<table><tr><td colspan="'+val.board_instance.size+'"><img title="Board instance: '+val.board_instance.board_instance_id+'" width="300" src="'+val.board_instance.assets[0].uri+'" /><input type="button" value="Unlock" onclick="unlockBoard(\''+val.board_instance.board_instance_id+'\');"><input type="button" value="Lock" onclick="lockBoard(\''+val.board_instance.board_instance_id+'\');"></td></tr>'+tds+'</table>').appendTo('#boardinstances');
            }

        });*/
    });

    snog_dispatcher.on(Snog.events.GET_BOARDS_INSTANCES_ERROR, function (data) 
    {
        
    });


    snog_dispatcher.on(Snog.events.DROP_INVENTORY_ITEM_SUCCESS, function (data) 
    {
        console.log("Dropped:"+data);

    });


    snog_dispatcher.on(Snog.events.TAKE_ITEM_FROM_BATCH_SUCCES, function (data) 
    {
            console.log("Success taking item from batch - " + data);
            getItemsPlayerInventory();
    });

    snog_dispatcher.on(Snog.events.UNLOCK_BOARD_INSTANCE_SUCCESS, function (data) 
    {
            console.log("Unlock success" + data);
    });

    snog_dispatcher.on(Snog.events.LOCK_BOARD_INSTANCE_SUCCESS, function (data) 
    {
            console.log("lock success");
            console.log(data);
            $("#btnReward").show();
    });

    snog_dispatcher.on(Snog.events.LOAD_BOARD_INSTANCE_AND_BAG_SUCCESS, function (data) 
    {
        console.log(data);
        /*var tds="<tr>";
        var j=0;

        for(j=0; j<val.board_instance.size;j++)
            tds+='<td id="slot'+j+'"><img width="60" src="'+val.board_instance.assets[1].uri+'" /></td>';

        tds+="</tr>";

        $('<table><tr><td colspan="'+val.board_instance.size+'"><img title="Board instance: '+val.board_instance.board_instance_id+'" width="300" src="'+val.board_instance.assets[0].uri+'" /></td></tr>'+tds+'</table>').appendTo('#dialogDetallePunchCard');

        getBagInstance(val.board_instance.board_instance_id);*/
        
    });

    snog_dispatcher.on(Snog.events.LOAD_BOARD_INSTANCE_BAG_SUCCESS, function (data) 
    {
                
        //Mostramos un dialogo con la información
        jQuery.each(data.bag_items, function(i, val) 
        {
            $("#slot"+val.slot_id).html('<img src="'+val.item_instance.assets[0].uri+'" width="60"/>');
        });
        $('#dialogDetallePunchCard').show();

        
        
    });

    snog_dispatcher.on(Snog.events.GET_REWARD_INSTANCES_SUCCESS, function (data) 
    {
            console.log("rewards success");
            console.log(data);
    });

    

});
