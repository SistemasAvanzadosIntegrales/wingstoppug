/**
 * Snog IE PHP proxy module;
 *
 * This module uses php to communicate with server side
 * for IE only.
 *
 * There is an issue that IE doesn't support
 * XMLHttpRequst and provides only XDomainRequest with
 * a list of limitations.
 *
 * One way to solve the problem is
 * to use flash proxy object another one is to use php
 * proxy.
 *
 * How to use:
 *
 * 1. place both snog_api.php and snog_ieproxy.php into the
 *    folder where the snog-{version}.js or snog{version}.min.js
 *    are located. Example: http://hostname/js
 *
 * 2. add this js file into html or php code to load
 *
 * 3. if browser is IE all requests will go using php
 *
 */
Snog.define('php_ieproxy', function (require, exports, module) {
    "use strict";

    // Override original functions for IE only;
    if(!jQuery.browser.msie) {
        return;
    }

    module.exports = {};

    // get script location and locate php;
    var scripts = document.getElementsByTagName('script');
    var pattern = /snog[.]js|snog[.]min[.]js|snog[-]/g;
    var url = "";
    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        if(pattern.test(script.src)) {

            // get path to the scrip;
            var path = script.src.split("/");
            path[0] = path[0] + '/';
            path.pop();

            // join path;
            for (var j = 0; j < path.length; j++) {
                var str = path[j];
                if(str != "" && j != path.length - 1) {
                    url += str + '/';
                }
            }
            break;
        }
    }

    var snog_api = require('api');
    var snog_data = require('data');
    snog_api.applyAJAX = function (request, response_message_type, error_types, prefixes) {
        if(!snog_api.isConnected()) {
            return;
        }

        var args = arguments;
        jQuery.ajax({
                   url  : url + '/snog_ieproxy.php',
                   type : 'POST',
                   data : { 'u' : snog_data.fe_api_url, 'r' : JSON.stringify(request) },

                   /**
                    * Handle php response and call original ajax success function
                    * @param json_response
                    */
                   success : function (json_response) {
                       snog_api.onAJAXSuccess(JSON.parse(json_response), args);
                   },

                   /**
                    * Handle php error response and call original ajax error function
                    * @param xhr
                    * @param ajaxOptions
                    * @param thrownError
                    */
                   error : function (xhr, ajaxOptions, thrownError) {
                       snog_api.onAJAXError.apply(null, arguments);
                   }
               });
    };
});