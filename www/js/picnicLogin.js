function loginRealm()
{
    var registro = JSON.parse(localStorage.getItem('pughpharm'));
    snog_dispatcher.broadcast(Snog.events.REALM_LOGIN, {token: registro.codigo, realm:"easier_loyalty"});
}


$(document).ready(function(){
    // Initialize Snog engine;
    Snog.all();
    Snog.debug = false;

    snog_data = Snog.require('data');
    snog_dispatcher = Snog.require('dispatcher');    


    snog_dispatcher.on(Snog.events.LOGIN_SUCCESS, function (data) 
    {
        //Guardamos en el local storage los datos de referencia a PICNIC
        localStorage.setItem('player_id',data.player_id);
        localStorage.setItem('auth_token',data.auth_token);
    });
});
