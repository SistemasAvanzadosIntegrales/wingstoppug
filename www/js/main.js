/*jslint sloppy:true, browser:true, devel:true, white:true, vars:true, eqeq:true, plusplus:true */
/*global $:false, intel:false*/
/** 
 * This function runs once the page is loaded, but intel is not yet active 
 */

/**
 * Prevent Default Scrolling 
 */


var onDeviceReady=function(){                             // called when Cordova is ready
   if( window.Cordova && navigator.splashscreen ) {     // Cordova API detected
        navigator.splashscreen.hide() ;                 // hide splash screen
    }
} ;
document.addEventListener("deviceready", onDeviceReady, false);

//Event listener for camera
document.addEventListener("intel.xdk.camera.picture.add",onSuccess); 
document.addEventListener("intel.xdk.camera.picture.busy",onSuccess); 
document.addEventListener("intel.xdk.camera.picture.cancel",onSuccess); 
var picturecount=0;

function onSuccess(imageURI) 
{
   
    var pic1 = document.getElementById("usr");

        var changebutton = document.getElementById("buttonid");    
        
        pic1.src = imageURI; 
        localStorage.setItem("imagen",JSON.stringify({'ruta':imageURI}));
      $('nav').animate({
				left: '0'
			});
			contador = 0;
}
function onSuccess2(imageURI) 
{
   
    var pic1 = document.getElementById("usr");

        var changebutton = document.getElementById("buttonid");    
        
        pic1.src = imageURI; 
    localStorage.setItem("imagen",JSON.stringify({'ruta':imageURI}));
    window.location = "miPerfil.html";
}

function onFail(message) {
  // alert("Picture failure: " + message);
}

function takepicture()
{
    
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI, saveToPhotoAlbum: true });

}

function takepicture2()
{
    
    navigator.camera.getPicture(onSuccess2, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI, saveToPhotoAlbum: true });

} 

//Seleccionar foto

function seleccionar(source){
    try{
    // Retrieve image file location from specified source
 navigator.camera.getPicture(onSuccess, onFail, { quality: 50, 
 targetWidth: 960,
 targetHeight: 960,
 destinationType: destinationType.FILE_URI,
 sourceType: source });
       
    }catch(e){
       // alert(e);
    }
}
