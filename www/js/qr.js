function leer(){     
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                alert("Resultados \n" +
                "Resultado: " + result.text + "\n" +
                "Formatp: " + result.format);
           }, 
            function (error) {
              alert("Scanning failed: " + error);
            }
        ); 
}

function generar(){     
        cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com", function(success) {
            alert("encode success: " + success);
          }, function(fail) {
            alert("encoding failed: " + fail);
          }
        
        ); 
}

