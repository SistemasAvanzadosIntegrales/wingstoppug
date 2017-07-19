$(function () {
    "use strict";

    Snog.require('data').setServerURL("https://avl-test-fe-api.snogengine.com/json");
    Snog.require('data').setUploaderRealm("avansys_manager");
    Snog.require('data').setUploaderURL("http://uploader.snogengine.com");
    Snog.require('realm').setLoginRealm("easier_loyalty");
});