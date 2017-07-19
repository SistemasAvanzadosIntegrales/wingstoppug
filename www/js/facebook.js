var accessToken = null;
function loginFacebook(){
    facebookConnectPlugin.login(
        ["public_profile", "email", "user_friends"],
        function(userData){
            facebookConnectPlugin.getAccessToken(
                function(token) {
                    accessToken = token;
                    facebookConnectPlugin.api('/me?fields=name,email', null,
                    function(response) {
                         facebookConnectPlugin.getLoginStatus(function(response) {   
                              if (response.status === 'connected') {
                                  alert(response.status);
                                    facebookConnectPlugin.showDialog({ method: "feed", message: "Come on man, check out my application." },
                                                function(success) {
                                                    alert("Sus "+success);
                                                }, function(error) {
                                                     alert("Err "+error);
                                                });
                                  
                              } else if (response.status === 'not_authorized') {
                                    alert(response.status);
                              } else {
                                  alert(response.status);
                              }
                        });
                    });
                },
                function(error) {
                    navigator.notification.alert("No se ha podido sincronizar con Facebook" +
                                         "\n\nMensaje: " + error, function(){}, '', 'Ok');
                }
            );
        },
        function(error){
            navigator.notification.alert("No se ha podido sincronizar con Facebook" +
                                         "\n\nMensaje: " + error, function(){}, '', 'Ok');
        }
    );
}
