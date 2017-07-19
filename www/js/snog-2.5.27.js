//------------------------------------------------------------------//
// Copyright © 2012 Pug Pharm Productions Inc. All rights reserved. //
//                                                                  //
// http://www.pugpharm.com  - it@pugpharm.com                       //
//------------------------------------------------------------------//

/**
 * Core module is based on CommonJS proposals and standards
 * for more information see http://www.commonjs.org/ and developed with
 * jQuery and its plugin jQuery.cookies;
 *
 * Module creates a global Snog object that hierarchically store its modules
 * and provides an easy access to them;
 *
 * To start working with Snog library developer should to the following steps:
 * 1. load the latest snog-{version}.js file;
 * 2. Call function Snog.all();
 *
 * After that each module can be accessed by require function.
 * There is "complete" list of modules that are included into core by default;
 *
 * var snog_api = Snog.require("api");
 * var snog_data = Snog.require("data");
 * var snog_dispatcher = Snog.require("dispatcher");
 * var snog_ws = Snog.require("web_socket");
 * var snog_callbacks = Snog.require("callbacks");
 * var snog_handlers = Snog.require("handlers");
 * var snog_facebook = Snog.require("facebook");
 * var snog_realm = Snog.require("realm");
 *
 * There are some additional modules that are added on demand
 *
 * var snog_widget = Snog.require('widget');
 * var snog_ieproxy = Snog.require('ieproxy');
 * var snog_recaptcha = Snog.require('recaptcha');
 * var snog_twitter = Snog.require('twitter');
 */
(function () {
    "use strict";

    // Define global object;
    window.Snog = {};

    // Define modules and events;
    Snog.modules = {};
    Snog.events = {};
    Snog.debug = false;
    Snog.ignoreErrors = false;

    /**
     * Wrapper for the console log function;
     * IE may not work if there is a log call;
     * @param {String} message
     */
    Snog.log = function (message) {
        if (!Snog.debug) {
            return;
        }

        try {
            console.log(message);
        } catch (e) {
        }
    };

    /**
     * Wrapper to handle error functions;
     * @param {String} message
     */
    Snog.error = function (message) {
        if (this.ignoreErrors) {
            this.log(message);
        } else {
            throw new Error(message, "SnogError");
        }
    };

    /**
     * Function that provides access to defined modules
     * and returns an instance of the module by id;
     *
     * @param {String} id of the module to return;
     * @return {Object}
     */
    Snog.require = function (id) {
        if (!Snog.modules.hasOwnProperty(id)) {
            throw new Error("module " + id + " not found");
        }

        var module = Snog.modules[id];
        if (module.fn) {
            var fn = module.fn;
            module.exports = {};
            delete module.fn;

            fn(Snog.require, module.exports, module);
        }

        return module.exports;
    };

    /**
     * Defines module instance by id;
     * @param {String} id
     * @param {Function} fn
     */
    Snog.define = function (id, fn) {
        if (Snog.modules.hasOwnProperty(id)) {
            throw new Error("module " + id + " already defined");
        }

        Snog.modules[id] = {id: id, fn: fn };
    };

    /**
     * Remove module by id;
     * @param {String} id
     */
    Snog.define.remove = function (id) {
        delete Snog.modules[id];
    };

    /**
     * Define all snog modules;
     */
    Snog.define('all', function (require, exports) {

        // module to send and receive events;
        exports.dispatcher = require('dispatcher');

        // module to store player's data;
        exports.data = require('data');

        // module to use web sockets;
        exports.web_socket = require('web_socket');

        // module to handle callbacks from the server;
        exports.callbacks = require('callbacks');

        // module to send requests to the server;
        exports.api = require('api');

        // module to send requests to the server;
        exports.handlers = require('handlers');

        // module to provide facebook functionality;
        exports.facebook = require('facebook');

        // module to provide realm functionality;
        exports.realm = require('realm');

    });

    /**
     * Function is to be called to define all snog modules;
     */
    Snog.all = function () {
        Snog.require('all');
    };

}).call(this);
/**
 * Object that contains all API events;
 * All params should be send as object.
 *
 * Example:
 * Snog.require("dispatcher").broadcast(Snog.events.DEBUG, { message : "HELLO" });
 * Snog.require("dispatcher").b(Snog.events.DEBUG, { message : "HELLO" });
 *
 * @type {Object}
 */
Snog.events = {

    //--------------------------------------------------------------------------------------------
    // ping event, params: null;
    //
    // Example:
    // broadcast(Snog.events.PING);
    //--------------------------------------------------------------------------------------------

    PING : "PING",

    // success response on PING event
    PONG : "PONG",

    //--------------------------------------------------------------------------------------------
    // Debug event, params:
    //                  - message
    // Example:
    // broadcast(Snog.events.DEBUG, { message: "" });
    //--------------------------------------------------------------------------------------------

    DEBUG                    : "DEBUG",

    //--------------------------------------------------------------------------------------------
    // General error responses
    //--------------------------------------------------------------------------------------------

    // response if there is something wrong with the request or server
    SERVER_ERROR             : "SERVER_ERROR",

    // response on most of the events if user is no authorized
    UNAUTHORIZED             : "UNAUTHORIZED",

    //--------------------------------------------------------------------------------------------
    // Notifications ( Asynchronous )
    //--------------------------------------------------------------------------------------------

    // notification than a new reward received
    NOTIFICATION_REWARD      : "NOTIFICATION_REWARD",

    // notification than a new message received
    NOTIFICATION_NEW_MESSAGE : "NOTIFICATION_NEW_MESSAGE",

    // general notification
    NOTIFICATION: "NOTIFICATION",

    //--------------------------------------------------------------------------------------------
    // Auto login event, params: null
    //
    // Example:
    // broadcast(Snog.events.AUTO_LOGIN);
    //--------------------------------------------------------------------------------------------

    AUTO_LOGIN         : "AUTO_LOGIN",

    // error response on AUTO_LOGIN event
    AUTO_LOGIN_ERROR   : "AUTO_LOGIN_ERROR",

    // success response on AUTO_LOGIN event
    AUTO_LOGIN_SUCCESS : "AUTO_LOGIN_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Sign up event, params:
    //                 - auth_challenge_id
    //                 - challenge_response
    //                 - email
    //                 - password
    //                 - first_name
    //                 - last_name
    //
    // Success signup response send via LOGIN_SUCCESS
    //
    // Example:
    // broadcast(Snog.events.SIGN_UP, { auth_challenge_id:"", challenge_response:"", email:"", password:"", first_name:"", last_name:"" });
    //--------------------------------------------------------------------------------------------

    SIGN_UP       : "SIGN_UP",
    SIGN_UP_ERROR : "SIGN_UP_ERROR",

    //--------------------------------------------------------------------------------------------
    // logout event, params: null
    //
    // Example:
    // broadcast(Snog.events.LOGOUT);
    //--------------------------------------------------------------------------------------------

    LOGOUT         : "LOGOUT",

    // success response on LOGOUT event
    LOGOUT_SUCCESS : "LOGOUT_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // login event, params:
    //                  - email
    //                  - password
    // Example:
    // broadcast(Snog.events.LOGIN, { email:"", password:"" });
    //--------------------------------------------------------------------------------------------

    LOGIN         : "LOGIN",

    // error response on LOGIN event
    LOGIN_ERROR   : "LOGIN_ERROR",

    // success response on LOGIN event
    LOGIN_SUCCESS : "LOGIN_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // reset password event, params:
    //                          - auth_challenge_id
    //                          - auth_challenge_response
    //                          - email
    // Example:
    // broadcast(Snog.events.RESET_PASSWORD, { auth_challenge_id:"", auth_challenge_response:"", email:"" });
    //--------------------------------------------------------------------------------------------

    RESET_PASSWORD         : "RESET_PASSWORD",

    // error response on RESET_PASSWORD event
    RESET_PASSWORD_ERROR   : "RESET_PASSWORD_ERROR",

    // success response on RESET_PASSWORD event, temporary password sent to email
    RESET_PASSWORD_SUCCESS : "RESET_PASSWORD_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // change password event, params:
    //                          - new_password
    // Example:
    // broadcast(Snog.events.CHANGE_PASSWORD, { new_password:"" });
    //--------------------------------------------------------------------------------------------

    CHANGE_PASSWORD         : "CHANGE_PASSWORD",

    // error response on CHANGE_PASSWORD event
    CHANGE_PASSWORD_ERROR   : "CHANGE_PASSWORD_ERROR",

    // success response on CHANGE_PASSWORD event
    CHANGE_PASSWORD_SUCCESS : "CHANGE_PASSWORD_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // get player's inventory event, params: null
    //
    // Example:
    // broadcast(Snog.events.GET_PLAYER_INVENTORY);
    //--------------------------------------------------------------------------------------------

    GET_PLAYER_INVENTORY         : "GET_PLAYER_INVENTORY",

    // error response on GET_PLAYER_INVENTORY event
    GET_PLAYER_INVENTORY_ERROR   : "GET_PLAYER_INVENTORY_ERROR",

    // success response on GET_PLAYER_INVENTORY event
    GET_PLAYER_INVENTORY_SUCCESS : "GET_PLAYER_INVENTORY_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // read item event, params:
    //                      - item_ref
    //
    // Example:
    // broadcast(Snog.events.READ_ITEM, { item_ref:"" });
    //--------------------------------------------------------------------------------------------

    READ_ITEM         : "READ_ITEM",

    // error response on READ_ITEM event
    READ_ITEM_ERROR   : "READ_ITEM_ERROR",

    // success response on READ_ITEM event
    READ_ITEM_SUCCESS : "READ_ITEM_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Read item instance event, params:
    //                              - item_instance_uuid
    // Example:
    // broadcast(Snog.events.READ_ITEM_INSTANCE, { item_instance_uuid:"" });
    //--------------------------------------------------------------------------------------------

    READ_ITEM_INSTANCE         : "READ_ITEM_INSTANCE",

    // error response on READ_ITEM_INSTANCE event
    READ_ITEM_INSTANCE_ERROR   : "READ_ITEM_INSTANCE_ERROR",

    // success response  on READ_ITEM_INSTANCE event
    READ_ITEM_INSTANCE_SUCCESS : "READ_ITEM_INSTANCE_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Add an item to the inventory from the batch, params:
    //                                                  - item_instance_uuid;
    //                                                  - batch_uuid;
    // Example:
    // broadcast(Snog.events.TAKE_ITEM_FROM_BATCH, { item_instance_uuid:"", batch_uuid:"" });
    //--------------------------------------------------------------------------------------------

    TAKE_ITEM_FROM_BATCH         : "TAKE_ITEM_FROM_BATCH",

    // error response
    TAKE_ITEM_FROM_BATCH_ERROR   : "TAKE_ITEM_FROM_BATCH_ERROR",

    // success response
    TAKE_ITEM_FROM_BATCH_SUCCESS : "TAKE_ITEM_FROM_BATCH_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Add item to the inventory from the igm event, params:
    //                                          - igm_id;
    //                                          - message_attachment_id
    // Example:
    // broadcast(Snog.events.TAKE_ITEM_FROM_IGM, { igm_id:"", message_attachment_id:"" });
    //--------------------------------------------------------------------------------------------

    TAKE_ITEM_FROM_IGM         : "TAKE_ITEM_FROM_IGM",

    // error response on TAKE_ITEM_FROM_IGM event
    TAKE_ITEM_FROM_IGM_ERROR   : "TAKE_ITEM_FROM_IGM_ERROR",

    // success response on TAKE_ITEM_FROM_IGM event
    TAKE_ITEM_FROM_IGM_SUCCESS : "TAKE_ITEM_FROM_IGM_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Drop (delete) an item event, params:
    //                                  - bag_id -> unique bag_id;
    //                                  - slot_id -> id of the slot in bag;
    //                                  - item_instance_uuid ( optional );
    // Example:
    // broadcast(Snog.events.DROP_ITEM, { bag_id:"", slot_id:"" });
    //--------------------------------------------------------------------------------------------

    DROP_ITEM         : "DROP_ITEM",

    // error response on DROP_ITEM event
    DROP_ITEM_ERROR   : "DROP_ITEM_ERROR",

    // success response on DROP_ITEM event
    DROP_ITEM_SUCCESS : "DROP_ITEM_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Drop (delete) an item from the inventory event, params:
    //                                                    - slot_id
    // Example:
    // broadcast(Snog.events.DROP_INVENTORY_ITEM, { slot_id:"" });
    //--------------------------------------------------------------------------------------------

    DROP_INVENTORY_ITEM         : "DROP_INVENTORY_ITEM",

    // error response on DROP_INVENTORY_ITEM event
    DROP_INVENTORY_ITEM_ERROR   : "DROP_INVENTORY_ITEM_ERROR",

    // success response on DROP_INVENTORY_ITEM event
    DROP_INVENTORY_ITEM_SUCCESS : "DROP_INVENTORY_ITEM_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Swap items event, params:
    //                      - from_bag_id
    //                      - from_slot_id
    //                      - from_item_instance_uuid
    //                      - to_bag_id
    //                      - to_slot_id
    //                      - to_item_instance_uuid
    // Example:
    // broadcast(Snog.events.SWAP_ITEM_INSTANCES, { from_bag_id:"", from_slot_id:"", from_item_instance_uuid:"", to_bag_id:"", to_slot_id:"", to_item_instance_uuid:"" });
    //--------------------------------------------------------------------------------------------

    SWAP_ITEM_INSTANCES         : "SWAP_ITEM_INSTANCES",

    // error response on SWAP_ITEM_INSTANCES event
    SWAP_ITEM_INSTANCES_ERROR   : "SWAP_ITEM_INSTANCES_ERROR",

    // success response on SWAP_ITEM_INSTANCES event
    SWAP_ITEM_INSTANCES_SUCCESS : "SWAP_ITEM_INSTANCES_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Gift item event, params:
    //                      - bag_id;
    //                      - slot_id;
    //                      - item_instance_uuid;
    //                      - player_id;
    //                      - message ( optional );
    // Example:
    // broadcast(Snog.events.GIFT_ITEM, { bag_id:"", slot_id:"", item_instance_uuid:"", player_id:"" });
    //--------------------------------------------------------------------------------------------

    GIFT_ITEM : "GIFT_ITEM",

    //--------------------------------------------------------------------------------------------
    // Gift an item via email event, params:
    //                                  - bag_id;
    //                                  - slot_id;
    //                                  - item_instance_uuid;
    //                                  - email;
    //                                  - message ( optional );
    // Example:
    // broadcast(Snog.events.GIFT_ITEM_VIA_EMAIL, { bag_id:"", slot_id:"", item_instance_uuid:"", email:"" });
    //--------------------------------------------------------------------------------------------

    GIFT_ITEM_VIA_EMAIL : "GIFT_ITEM_VIA_EMAIL",

    // error response on GIFT_ITEM || GIFT_ITEM_VIA_EMAIL event
    GIFT_ITEM_ERROR     : "GIFT_ITEM_ERROR",

    // success response on GIFT_ITEM || GIFT_ITEM_VIA_EMAIL event
    GIFT_ITEM_SUCCESS   : "GIFT_ITEM_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Get a batch of items event, params:
    //                                - size
    //                                - ttl
    // Example:
    // broadcast(Snog.events.GET_ITEM_BATCH, { size:"", ttl:"" });
    //--------------------------------------------------------------------------------------------

    GET_ITEM_BATCH         : "GET_ITEM_BATCH",

    // error response on GET_ITEM_BATCH event
    GET_ITEM_BATCH_ERROR   : "GET_ITEM_BATCH_ERROR",

    // success response on GET_ITEM_BATCH event
    GET_ITEM_BATCH_SUCCESS : "GET_ITEM_BATCH_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Get boards list event, params:
    //                           - type
    //                           - filter
    // Example:
    // broadcast(Snog.events.GET_BOARDS_LIST, {type : "compatibility", filter : "all"} );
    //--------------------------------------------------------------------------------------------

    GET_BOARDS_LIST         : "GET_BOARDS_LIST",

    // error response on GET_BOARDS_LIST event
    GET_BOARDS_LIST_ERROR   : "GET_BOARDS_LIST_ERROR",

    // success response on GET_BOARDS_LIST event
    GET_BOARDS_LIST_SUCCESS : "GET_BOARDS_LIST_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Get board instances list event, params:
    //                                  - type
    //                                  - player_id ( optional );
    // Example:
    // broadcast(Snog.events.GET_BOARDS_INSTANCES, { type:"" });
    //--------------------------------------------------------------------------------------------

    GET_BOARDS_INSTANCES         : "GET_BOARDS_INSTANCES",

    // error response on GET_BOARDS_INSTANCES event
    GET_BOARDS_INSTANCES_ERROR   : "GET_BOARDS_INSTANCES_ERROR",

    // success response on GET_BOARDS_INSTANCES event
    GET_BOARDS_INSTANCES_SUCCESS : "GET_BOARDS_INSTANCES_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Create a board instance event, params:
    //                                   - board_ref
    // Example:
    // broadcast(Snog.events.CREATE_BOARD_INSTANCE, { board_ref:"" });
    //--------------------------------------------------------------------------------------------

    CREATE_BOARD_INSTANCE         : "CREATE_BOARD_INSTANCE",

    // error response on CREATE_BOARD_INSTANCE event
    CREATE_BOARD_INSTANCE_ERROR   : "CREATE_BOARD_INSTANCE_ERROR",

    // success response on CREATE_BOARD_INSTANCE event
    CREATE_BOARD_INSTANCE_SUCCESS : "CREATE_BOARD_INSTANCE_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Get board instance data event, params:
    //                                  - board_instance_id
    // Example:
    // broadcast(Snog.events.READ_BOARD_INSTANCE, { board_instance_id:"" });
    //--------------------------------------------------------------------------------------------

    READ_BOARD_INSTANCE         : "READ_BOARD_INSTANCE",

    // error response on READ_BOARD_INSTANCE event
    READ_BOARD_INSTANCE_ERROR   : "READ_BOARD_INSTANCE_ERROR",

    // success response on READ_BOARD_INSTANCE event
    READ_BOARD_INSTANCE_SUCCESS : "READ_BOARD_INSTANCE_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Update board instance comment event, params:
    //                              - board_instance_id
    //                              - comment ( optional )
    // Example:
    // broadcast(Snog.events.UPDATE_BOARD_INSTANCE_COMMENT, { board_instance_id:"" });
    //--------------------------------------------------------------------------------------------

    UPDATE_BOARD_INSTANCE_COMMENT         : "UPDATE_BOARD_INSTANCE_COMMENT",

    // error response on UPDATE_BOARD_INSTANCE_COMMENT event
    UPDATE_BOARD_INSTANCE_COMMENT_ERROR   : "UPDATE_BOARD_INSTANCE_COMMENT_ERROR",

    // success response on UPDATE_BOARD_INSTANCE_COMMENT event
    UPDATE_BOARD_INSTANCE_COMMENT_SUCCESS : "UPDATE_BOARD_INSTANCE_COMMENT_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Lock board instance event, params:
    //                              - board_instance_id
    //                              - comment ( optional )
    // Example:
    // broadcast(Snog.events.LOCK_BOARD_INSTANCE, { board_instance_id:"" });
    //--------------------------------------------------------------------------------------------

    LOCK_BOARD_INSTANCE         : "LOCK_BOARD_INSTANCE",

    // error response on LOCK_BOARD_INSTANCE event
    LOCK_BOARD_INSTANCE_ERROR   : "LOCK_BOARD_INSTANCE_ERROR",

    // success response on LOCK_BOARD_INSTANCE event
    LOCK_BOARD_INSTANCE_SUCCESS : "LOCK_BOARD_INSTANCE_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Unlock board instance event, params:
    //                                 - board_instance_id
    // Example:
    // broadcast(Snog.events.UNLOCK_BOARD_INSTANCE, { board_instance_id:"" });
    //--------------------------------------------------------------------------------------------

    UNLOCK_BOARD_INSTANCE         : "UNLOCK_BOARD_INSTANCE",

    // error response on UNLOCK_BOARD_INSTANCE event
    UNLOCK_BOARD_INSTANCE_ERROR   : "UNLOCK_BOARD_INSTANCE_ERROR",

    // success response on UNLOCK_BOARD_INSTANCE event
    UNLOCK_BOARD_INSTANCE_SUCCESS : "UNLOCK_BOARD_INSTANCE_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Delete board instance event, params:
    //                                - board_instance_id
    // Example:
    // broadcast(Snog.events.DELETE_BOARD_INSTANCE, { board_instance_id:"" });
    //--------------------------------------------------------------------------------------------

    DELETE_BOARD_INSTANCE         : "DELETE_BOARD_INSTANCE",

    // error response on DELETE_BOARD_INSTANCE event
    DELETE_BOARD_INSTANCE_ERROR   : "DELETE_BOARD_INSTANCE_ERROR",

    // success response on DELETE_BOARD_INSTANCE event
    DELETE_BOARD_INSTANCE_SUCCESS : "DELETE_BOARD_INSTANCE_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Load board instance bag event, params:
    //                                  -board_instance_id
    //                                  -player_id ( optional );
    // Example:
    // broadcast(Snog.events.LOAD_BOARD_INSTANCE_BAG, { board_instance_id:"" });
    //--------------------------------------------------------------------------------------------

    LOAD_BOARD_INSTANCE_BAG         : "LOAD_BOARD_INSTANCE_BAG",

    // error response on LOAD_BOARD_INSTANCE_BAG event
    LOAD_BOARD_INSTANCE_BAG_ERROR   : "LOAD_BOARD_INSTANCE_BAG_ERROR",

    // success response on LOAD_BOARD_INSTANCE_BAG event
    LOAD_BOARD_INSTANCE_BAG_SUCCESS : "LOAD_BOARD_INSTANCE_BAG_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Asynchronous event to get player status, params:
    //                                            - player_id
    // Example:
    // broadcast(Snog.events.READ_PLAYER_STATUS, { player_id:"" });
    //--------------------------------------------------------------------------------------------

    READ_PLAYER_STATUS : "READ_STATUS_MESSAGE",

    // player status response
    PLAYER_STATUS      : "PLAYER_STATUS",

    STATUS_MESSAGE     : "STATUS_MESSAGE",

    //--------------------------------------------------------------------------------------------
    // Read player's profile event, params:
    //                                 - player_id ( optional )
    // Example:
    // broadcast(Snog.events.READ_PLAYER_PROFILE);
    //--------------------------------------------------------------------------------------------

    READ_PLAYER_PROFILE         : "READ_PROFILE",

    // error response on READ_PLAYER_PROFILE event
    READ_PLAYER_PROFILE_ERROR   : "READ_PROFILE_ERROR",

    // success response on READ_PLAYER_PROFILE event
    READ_PLAYER_PROFILE_SUCCESS : "READ_PROFILE_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Update player's profile event, params:
    //                                  - first_name
    //                                  - last_name
    //                                  - privacy ( optional )
    //                                  - gender ( optional )
    //                                  - city ( optional )
    //                                  - country_code ( optional )
    //                                  - birth_year ( optional )
    //                                  - birth_month ( optional )
    //                                  - birth_day ( optional )
    // Example:
    // broadcast(Snog.events.UPDATE_PLAYER_PROFILE, { first_name:"", last_name:"" });
    //--------------------------------------------------------------------------------------------

    UPDATE_PLAYER_PROFILE         : "UPDATE_PLAYER_PROFILE",

    // error response on UPDATE_PLAYER_PROFILE event
    UPDATE_PLAYER_PROFILE_ERROR   : "UPDATE_PLAYER_PROFILE_ERROR",

    // success response on UPDATE_PLAYER_PROFILE event
    UPDATE_PLAYER_PROFILE_SUCCESS : "UPDATE_PLAYER_PROFILE_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Update or change player's avatar event, params:
    //                                      - avatar_uri
    // Example:
    // broadcast(Snog.events.UPDATE_PLAYER_AVATAR, { avatar_uri:"" });
    //--------------------------------------------------------------------------------------------

    UPDATE_PLAYER_AVATAR         : "UPDATE_PLAYER_AVATAR",

    // error response on UPDATE_PLAYER_AVATAR event
    UPDATE_PLAYER_AVATAR_ERROR   : "UPDATE_PLAYER_AVATAR_ERROR",

    // success response on UPDATE_PLAYER_AVATAR event
    UPDATE_PLAYER_AVATAR_SUCCESS : "UPDATE_PLAYER_AVATAR_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Load player's inbox messages event, params: null
    //
    // Example:
    // broadcast(Snog.events.LOAD_INBOX_MESSAGES);
    //--------------------------------------------------------------------------------------------

    LOAD_INBOX_MESSAGES         : "LOAD_INBOX_MESSAGES",

    // error response on LOAD_INBOX_MESSAGES event
    LOAD_INBOX_MESSAGES_ERROR   : "LOAD_INBOX_MESSAGES_ERROR",

    // success response on LOAD_INBOX_MESSAGES event
    LOAD_INBOX_MESSAGES_SUCCESS : "LOAD_INBOX_MESSAGES_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Load player's inbox messages event, params:
    //                                          - page_index
    //                                          - page_size
    //
    // Example:
    // broadcast(Snog.events.LOAD_PAGED_INBOX_MESSAGE, { page_index: 0, page_size: 10});
    //--------------------------------------------------------------------------------------------

    LOAD_PAGED_INBOX_MESSAGES        : "LOAD_PAGED_INBOX_MESSAGES",
    LOAD_PAGED_INBOX_MESSAGES_ERROR  : "LOAD_PAGED_INBOX_MESSAGES_ERROR",
    LOAD_PAGED_INBOX_MESSAGES_SUCCESS: "LOAD_PAGED_INBOX_MESSAGES_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Load player's inbox messages event, params: null
    //
    // Example:
    // broadcast(Snog.events.LOAD_OUTBOX_MESSAGES);
    //--------------------------------------------------------------------------------------------

    LOAD_OUTBOX_MESSAGES         : "LOAD_OUTBOX_MESSAGES",

    // error response on LOAD_OUTBOX_MESSAGES event
    LOAD_OUTBOX_MESSAGES_ERROR   : "LOAD_OUTBOX_MESSAGES_ERROR",

    // success response on LOAD_OUTBOX_MESSAGES event
    LOAD_OUTBOX_MESSAGES_SUCCESS : "LOAD_OUTBOX_MESSAGES_SUCCESS",


    //--------------------------------------------------------------------------------------------
    // Load player's outbox messages event, params:
    //                                          - page_index
    //                                          - page_size
    //
    // Example:
    // broadcast(Snog.events.LOAD_PAGED_OUTBOX_MESSAGE, { page_index: 0, page_size: 10});
    //--------------------------------------------------------------------------------------------

    LOAD_PAGED_OUTBOX_MESSAGES        : "LOAD_PAGED_OUTBOX_MESSAGES",
    LOAD_PAGED_OUTBOX_MESSAGES_ERROR  : "LOAD_PAGED_OUTBOX_MESSAGES_ERROR",
    LOAD_PAGED_OUTBOX_MESSAGES_SUCCESS: "LOAD_PAGED_OUTBOX_MESSAGES_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Asynchronous event to send a new game message, params:
    //                                                  - type
    //                                                  - to_player_id
    //                                                  - title
    //                                                  - body
    //
    // Success response is received via NEW_MESSAGE_ACKNOWLEDGEMENT event
    //
    // Example:
    // broadcast(Snog.events.NEW_IGM, { type:"", to_player_id:"", title:"", body:"" });
    //--------------------------------------------------------------------------------------------

    NEW_IGM       : "NEW_IGM",

    // error response on NEW_IGM event
    NEW_IGM_ERROR : "NEW_IGM_ERROR",

    //--------------------------------------------------------------------------------------------
    // Asynchronous event to reply on a game message, params:
    //                                                   - igm_id
    //                                                   - body
    //
    // Success response is received via REPLY_MESSAGE_ACKNOWLEDGEMENT event
    //
    // Example:
    // broadcast(Snog.events.REPLY_MESSAGE, { igm_id:"", body:"" });
    //--------------------------------------------------------------------------------------------

    REPLY_MESSAGE       : "REPLY_MESSAGE",

    // error response on REPLY_MESSAGE event
    REPLY_MESSAGE_ERROR : "REPLY_MESSAGE_ERROR",

    //--------------------------------------------------------------------------------------------
    // friendship request event, params:
    //                              - player_id
    // Example:
    // broadcast(Snog.events.PROPOSE_FRIENDSHIP, { player_id:"" });
    //--------------------------------------------------------------------------------------------

    PROPOSE_FRIENDSHIP         : "PROPOSE_FRIENDSHIP",

    // error response on PROPOSE_FRIENDSHIP event
    PROPOSE_FRIENDSHIP_ERROR   : "PROPOSE_FRIENDSHIP_ERROR",

    // success response on PROPOSE_FRIENDSHIP event
    PROPOSE_FRIENDSHIP_SUCCESS : "PROPOSE_FRIENDSHIP_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Load friends list event, params:
    //                            - player_id
    // Example:
    // broadcast(Snog.events.LOAD_FRIENDS, { player_id:"" });
    //--------------------------------------------------------------------------------------------

    LOAD_FRIENDS         : "LOAD_FRIENDS",

    // error response on LOAD_FRIENDS event
    LOAD_FRIENDS_ERROR   : "LOAD_FRIENDS_ERROR",

    // success response on LOAD_FRIENDS event
    LOAD_FRIENDS_SUCCESS : "LOAD_FRIENDS_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Read a message body event, params:
    //                               - igm_id
    // Example:
    // broadcast(Snog.events.READ_MESSAGE, { igm_id:"" });
    //--------------------------------------------------------------------------------------------

    READ_MESSAGE         : "READ_MESSAGE",

    // error response on READ_MESSAGE event
    READ_MESSAGE_ERROR   : "READ_MESSAGE_ERROR",

    // success response on READ_MESSAGE event
    READ_MESSAGE_SUCCESS : "READ_MESSAGE_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Asynchronous event to delete a game message, params:
    //                                                  - igm_id
    //
    // Success response is received via DELETE_MESSAGE_ACKNOWLEDGEMENT event
    //
    // Example:
    // broadcast(Snog.events.DELETE_MESSAGE, { igm_id:"" });
    //--------------------------------------------------------------------------------------------

    DELETE_MESSAGE       : "DELETE_MESSAGE",

    // error response on DELETE_MESSAGE event
    DELETE_MESSAGE_ERROR : "DELETE_MESSAGE_ERROR",

    //--------------------------------------------------------------------------------------------
    // Captcha request event, params: null
    //
    // Example:
    // broadcast(Snog.events.NEW_AUTH_CHALLENGE_REQUEST);
    //--------------------------------------------------------------------------------------------

    NEW_AUTH_CHALLENGE_REQUEST : "NEW_AUTH_CHALLENGE_REQUEST",

    // error response on NEW_AUTH_CHALLENGE_REQUEST event
    NEW_AUTH_CHALLENGE_ERROR   : "NEW_AUTH_CHALLENGE_ERROR",

    // success response on NEW_AUTH_CHALLENGE_REQUEST event
    NEW_AUTH_CHALLENGE_SUCCESS : "NEW_AUTH_CHALLENGE_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Get rewards list event, params: null
    //
    // Example:
    // broadcast(Snog.events.GET_REWARDS);
    //--------------------------------------------------------------------------------------------

    GET_REWARDS         : "GET_REWARDS",

    // error response on GET_REWARDS event
    GET_REWARDS_ERROR   : "GET_REWARDS_ERROR",

    // success response on GET_REWARDS event
    GET_REWARDS_SUCCESS : "GET_REWARDS_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Get player's rewards event, params:
    //                                  - player_id
    // Example:
    // broadcast(Snog.events.GET_REWARD_INSTANCES, { player_id:"" });
    //--------------------------------------------------------------------------------------------

    GET_REWARD_INSTANCES         : "GET_REWARD_INSTANCES",

    // error response on GET_REWARD_INSTANCES event
    GET_REWARD_INSTANCES_ERROR   : "GET_REWARD_INSTANCES_ERROR",

    // success response on GET_REWARD_INSTANCES event
    GET_REWARD_INSTANCES_SUCCESS : "GET_REWARD_INSTANCES_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // get leader board event, params:
    //                              - type
    //                              - board_ref ( optional )
    //                              - board_refs ( optional )
    //                              - filter ( optional )
    //                              - page  ( optional )
    //                              - page_size ( optional )
    // Example:
    // broadcast(Snog.events.GET_LEADERBOARD, { type:"" });
    //--------------------------------------------------------------------------------------------

    GET_LEADERBOARD         : "GET_LEADERBOARD",

    // error response on get GET_LEADERBOARD event
    GET_LEADERBOARD_ERROR   : "GET_LEADERBOARD_ERROR",

    // success response on get GET_LEADERBOARD event
    GET_LEADERBOARD_SUCCESS : "GET_LEADERBOARD_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // asynchronous event to get compatibility results, params:
    //                                                      - board_instance_id
    // Example:
    // broadcast(Snog.events.CALCULATE_COMPATIBILITY, { board_instance_id:"" });
    //--------------------------------------------------------------------------------------------

    CALCULATE_COMPATIBILITY         : "CALCULATE_COMPATIBILITY",

    // error response on CALCULATE_COMPATIBILITY event
    CALCULATE_COMPATIBILITY_ERROR   : "CALCULATE_COMPATIBILITY_ERROR",

    // success response on CALCULATE_COMPATIBILITY event
    CALCULATE_COMPATIBILITY_SUCCESS : "CALCULATE_COMPATIBILITY_SUCCESS",

    //--------------------------------------------------------------------------------------------
    //  asynchronous request to find players, params:
    //                                          - search_terms
    // Example:
    // broadcast(Snog.events.FIND_PLAYERS, { search_terms:"" });
    //--------------------------------------------------------------------------------------------

    FIND_PLAYERS         : "FIND_PLAYERS",

    // error response on FIND_PLAYERS event
    FIND_PLAYERS_ERROR   : "FIND_PLAYERS_ERROR",

    // success response on FIND_PLAYERS event
    FIND_PLAYERS_SUCCESS : "FIND_PLAYERS_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Acknowledgement responses for different async. events
    //--------------------------------------------------------------------------------------------

    FIND_PLAYERS_ACKNOWLEDGEMENT   : "FIND_PLAYERS_ACKNOWLEDGEMENT",
    DELETE_MESSAGE_ACKNOWLEDGEMENT : "DELETE_MESSAGE_ACKNOWLEDGEMENT",
    COMPATIBILITY_ACKNOWLEDGEMENT  : "COMPATIBILITY_ACKNOWLEDGEMENT",
    REPLY_MESSAGE_ACKNOWLEDGEMENT  : "REPLY_MESSAGE_ACKNOWLEDGEMENT",
    NEW_MESSAGE_ACKNOWLEDGEMENT    : "NEW_MESSAGE_ACKNOWLEDGEMENT",
    REDEEM_CODE_ACKNOWLEDGEMENT    : "REDEEM_CODE_ACKNOWLEDGEMENT",

    //--------------------------------------------------------------------------------------------
    // Get player's milestones event, params: null
    //
    // Example:
    // broadcast(Snog.events.GET_MILESTONES);
    //--------------------------------------------------------------------------------------------

    GET_MILESTONES                 : "GET_MILESTONES",
    GET_MILESTONES_ERROR           : "GET_MILESTONES_ERROR",
    GET_MILESTONES_SUCCESS         : "GET_MILESTONES_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Get player's single milestone event, params:
    //                                  - milestone_ref
    // Example:
    // broadcast(Snog.events.READ_MILESTONE, { milestone_ref:"{String}" });
    //--------------------------------------------------------------------------------------------

    READ_MILESTONE                 : "READ_MILESTONE",
    READ_MILESTONE_ERROR           : "READ_MILESTONE_ERROR",
    READ_MILESTONE_SUCCESS         : "READ_MILESTONE_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Get player's preference event, params:
    //                                  - key
    // Example:
    // broadcast(Snog.events.GET_PREFERENCE, {key:"{String}" });
    //--------------------------------------------------------------------------------------------

    GET_PREFERENCE:"GET_PREFERENCE",
    GET_PREFERENCE_ERROR:"GET_PREFERENCE_ERROR",
    GET_PREFERENCE_SUCCESS:"GET_PREFERENCE_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Set player's preference event, params:
    //                                  - key
    //                                  - visibility ['all','friends','self']
    //                                  - value (optional)
    // Example:
    // broadcast(Snog.events.SET_PREFERENCE, {key:"{String}", visibility:"self", value:"{String}"});
    //--------------------------------------------------------------------------------------------

    SET_PREFERENCE:"SET_PREFERENCE",
    SET_PREFERENCE_ERROR:"SET_PREFERENCE_ERROR",
    SET_PREFERENCE_SUCCESS:"SET_PREFERENCE_SUCCESS",

    //--------------------------------------------------------------------------------------------
    // Redeem code event, params:
    //                                  - key
    // Example:
    // broadcast(Snog.events.REDEEM_CODE, {key:"{String}"});
    //--------------------------------------------------------------------------------------------

    REDEEM_CODE: "REDEEM_CODE",
    REDEEM_CODE_ERROR: "REDEEM_CODE_ERROR"
};
//Fix for IE;
if(!('filter' in Array.prototype)) {
    Array.prototype.filter = function (filter, that) {
        var other = [], v, i;
        for (var i = 0, n = this.length; i < n; i++) {
            if(i in this && filter.call(that, v = this[i], i, this)) {
                other.push(v);
            }
        }
        return other;
    };
}

if(!('forEach' in Array.prototype)) {
    Array.prototype.forEach = function (action, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++) {
            if(i in this) {
                action.call(that, this[i], i, this);
            }
        }
    };
}

/**
 * Dispatcher module provides events broadcasting.
 *
 * In order to handle an event, the listener must me set.
 * In order to broadcast event, simply call 'broadcast' or 'b' function and pass event and params.
 * Ps. params could be optional
 *
 * @example
 *
 * // handle pong event
 * Snog.require('dispatcher').on( Snog.events.PONG, function() { console.log('pong' } );
 *
 *
 * // send ping request
 * Snog.require('dispatcher').b( Snog.events.PING );
 *
 */
Snog.define('dispatcher', function (require, exports, module) {
    "use strict";

    // Array of the listeners;
    module.listeners = [];

    /**
     * Dispatch an event;
     *
     * @param {String} event_id of the event to dispatch;
     * @param {Object} data to dispatch;
     *
     * @return {Object} this dispatcher module
     */
    exports.broadcast = function (event_id, data) {
        var args = Array.prototype.slice.call(arguments, 1);
        var array = module.listeners.filter(function (e) {
            return e.event === event_id;
        });

        // debug each broadcasted message;
        if (Snog.debug) {
            // IE doesn't have group method;
            try {
                Snog.log( "------- " + event_id + " -------" );
                Snog.log( " " +  new Date().toTimeString());
                if ( args.length !== 0 ) {
                    Snog.log( JSON.stringify(args ));
                }
                Snog.log( '');
            } catch (err) {
            }
        }

        array.forEach(function (e) {
            module.event = function () {
                return {
                    'trigger'  : event_id,
                    'match'    : e,
                    'arguments': args
                };
            };

            if(e.fn) {
                e.fn.apply(module, args);
            }
        });

        return this;
    };

    /**
     * Shortcut on broadcast method
     * @see broadcast
     */
    exports.b = exports.broadcast;

    /**
     * Add handler function by event id;
     *
     * @param {String} event_id
     * @param {Function} fn
     *
     * @return {Object} this dispatcher module
     */
    exports.on = function (event_id, fn) {
        module.listeners.push({event: event_id, fn: fn});
        return this;
    };

    /**
     * Shortcut for on function
     */
    exports.o = exports.on;

    /**
     * Remove handler function
     * @param {String} event_id
     * @param {Function} fn
     */
    exports.remove = function (event_id, fn) {
        var i;
        for (i = 0; i < module.listeners.length; i += 1) {
            if(module.listeners[i].event === event_id && module.listeners[i].fn === fn) {
                module.listeners.splice(i, 1);
                i -= 1;
            }
        }

        return this;
    };

    /**
     * Shortcut on remove method
     */
    exports.r = exports.remove;

    /**
     * Remove all handlers that match event_id
     *
     * @param {String} event_id
     */
    exports.removeAllByEventID = function( event_id ) {
        var i;
        for (i = 0; i < module.listeners.length; i += 1) {
            if(module.listeners[i].event === event_id) {
                module.listeners.splice(i, 1);
                i -= 1;
            }
        }

        return this;
    };
});
/**
 * Extend original Snog.events by adding data change events;
 */
Snog.events.BATCH_CHANGED = "BATCH_CHANGED";                            // batch change event
Snog.events.PROFILE_CHANGED = "PROFILE_CHANGED";                        // profile change event
Snog.events.INBOX_MESSAGES_CHANGED = "INBOX_MESSAGES_CHANGED";          // inbox messages change event
Snog.events.OUTBOX_MESSAGES_CHANGED = "OUTBOX_MESSAGES_CHANGED";        // outbox messages change event
Snog.events.PROFILES_CHANGED = "PROFILES_CHANGED";                      // profile change event
Snog.events.FRIENDS_CHANGED = "FRIENDS_CHANGED";                        // friends change event
Snog.events.MESSAGE_CHANGED = "MESSAGE_CHANGED";                        // message change event
Snog.events.MESSAGE_DELETED = "MESSAGE_DELETED";                        // message deleted event
Snog.events.REWARDS_CHANGED = "REWARDS_CHANGED";                        // rewards change event
Snog.events.REWARD_INSTANCES_CHANGED = "REWARD_INSTANCES_CHANGED";      // reward instances change event
Snog.events.BOARDS_CHANGED = "BOARDS_CHANGED";                          // boards change event
Snog.events.BOARD_UPDATED = "BOARD_UPDATED";                            // board update event
Snog.events.BOARD_SLOTS_CHANGED = "BOARD_SLOTS_CHANGED";                // board slots change event
Snog.events.BOARD_INSTANCE_CHANGED = "BOARD_INSTANCE_CHANGED";          // board instances change event
Snog.events.BAG_CHANGED = "BAG_CHANGED";                                // bag change event
Snog.events.COMPATIBILITY_CHANGED = "COMPATIBILITY_CHANGED";            // compatibility change event
Snog.events.LEADERS_CHANGED = "LEADERS_CHANGED";                        // leaders change event
Snog.events.ITEM_CHANGED = "ITEM_CHANGED";                              // item change event
Snog.events.ITEM_INSTANCE_CHANGED = "ITEM_INSTANCE_CHANGED";            // item instance change event
Snog.events.MILESTONES_CHANGED = "MILESTONES_CHANGED";                  // list of milestones change event
Snog.events.MILESTONE_CHANGED = "MILESTONE_CHANGED";                    // single milestone change event
Snog.events.PREFERENCE_CHANGED = "PREFERENCE_CHANGED";                  // preference change event
Snog.events.PLAYER_STATUS_CHANGED = "PLAYER_STATUS_CHANGED";            // player status change event

/**
 * Models module consist of classes used in data module;
 */
Snog.define("models", function (require, exports, module) {
    "use strict";

    var snog_dispatcher = require('dispatcher');

    /**
     * Bag model;
     */
    exports.BagModel = function () {
        this.slots = null;      // {Array} items
        this.bag_id = null;     // {Number} unique bag id;
        this.size = null;       // {Number} bag size;
        this.totalItems = null; // {Number} number of occupied items;
        this.isFull = false;    // {Boolean} true if bag is full;
        this.player_id = null;  // {Number} unique player id;
        this.isLoaded = false;  // {Boolean} flag to make sure that bag is loaded

        /**
         * Clear all data;
         */
        this.onDestroy = function () {
            require("data").destroy(this);
        };

        /**
         * Set bag;
         * @param {Object} response_message
         */
        this.setBag = function (response_message) {
            if (response_message === null || response_message === undefined) {
                return;
            }

            this.slots = [];
            this.bag_id = parseInt(response_message.bag_id, 10);
            this.size = parseInt(response_message.size, 10);
            this.isLoaded = true;

            // fill array with empty models data;
            var i;
            for (i = 0; i < this.size; i += 1) {
                this.slots[i] = { message_type: 'bag_item', slot_id: i, item_instance: null };
            }

            // fill array with items;
            var array = response_message.bag_items;
            if (array !== null && array !== undefined) {
                for (i = 0; i < array.length; i += 1) {
                    var item = array[i];
                    this.slots[item.slot_id] = item;
                }
            }

            this._update();
            snog_dispatcher.b(Snog.events.BAG_CHANGED, this);
        };

        /**
         * Returns bag slot by slot_id;
         * @param {Number} slot_id
         * @return {Object|null}
         */
        this.getSlotByID = function (slot_id) {
            var index = parseInt(slot_id, 10);
            if (this.slots !== null && this.slots[index] !== null && this.slots[index].slot_id === index) {
                return this.slots[index];
            } else {
                // search for item;
                // normally should not be called;
                var i;
                for (i = 0; i < this.size; i += 1) {
                    var slot = this.slots[i];
                    if (slot !== null && slot.slot_id === index) {
                        return slot;
                    }
                }
            }

            return null;
        };

        /**
         * Returns 1st empty slot or null;
         * @return {Object|null}
         */
        this.getEmptySlot = function () {
            var i;
            for (i = 0; i < this.size; i += 1) {
                var slot = this.slots[i];
                if (slot !== null && slot.item_instance === null) {
                    return slot;
                }
            }

            return null;
        };

        /**
         * Removes item from desired slot;
         * @param {Number} slot_id
         */
        this.removeItemInstanceAtSlot = function (slot_id) {
            var i;
            for (i = 0; i < this.size; i += 1) {
                var slot = this.slots[i];
                if (slot !== null && slot.slot_id === slot_id) {

                    // check for an empty item;
                    // to avoid sending change event;
                    if (this.slots[i].item_instance === null) {
                        return;
                    }
                    this.slots[i].item_instance = null;
                    break;
                }
            }

            this._update();
            snog_dispatcher.b(Snog.events.BAG_CHANGED, this);
        };

        /**
         * Add single item instance;
         * If slot_id is undefined, then used first unoccupied slot.
         *
         * @param {Object} instance
         * @param {Number} slot_id (optional);
         */
        this.addItemInstance = function (instance, slot_id) {
            if (this.isFull) {
                return;
            }

            // set player_id;
            // override player's id;
            if (!instance.hasOwnProperty('credited_player_id') || instance.credited_player_id === null) {
                instance.credited_player_id = require("data").player_id;
            }

            // get first not occupied slot;
            var index = 0;
            if (slot_id === undefined || slot_id === null) {

                var empty_slot = this.getEmptySlot();
                if (empty_slot !== null) {
                    index = empty_slot.slot_id;
                } else {

                    // there are no empty slots
                    Snog.error("There are no empty slots to add an item instance")
                }
            } else {
                index = parseInt(slot_id, 10)
            }

            if (this.slots === null) {
                this.slots = [];
            }

            this.slots[index].item_instance = instance;
            this._update();
            snog_dispatcher.b(Snog.events.BAG_CHANGED, this);
        };

        /**
         * Swap items instances in the desired slots
         *
         * @param {Number} from_slot_id
         * @param {Number} to_slot_id
         *
         */
        this.swapItemsBySlots = function (from_slot_id, to_slot_id) {
            var slot_to = this.slots[ parseInt(to_slot_id, 10) ];
            if (slot_to === null) {
                Snog.error("Can't find slot at " + to_slot_id + " index");
            }

            var slot_from = this.slots[ parseInt(from_slot_id, 10) ];
            if (slot_from === null) {
                Snog.error("Can't find slot at " + from_slot_id + " index");
            }

            var item_instance = slot_from.item_instance;
            slot_from.item_instance = slot_to.item_instance;
            slot_to.item_instance = item_instance;

            snog_dispatcher.b(Snog.events.BAG_CHANGED, this);
        };

        /**
         * Update inner bag properties
         * ;
         * @private
         */
        this._update = function () {
            this.totalItems = 0;
            var i;
            for (i = 0; i < this.size; i += 1) {
                if (this.slots[i] && this.slots[i].item_instance !== null) {
                    this.totalItems += 1;
                }
            }

            this.isFull = this.totalItems === this.size;
        };

        /**
         * Search all items instances for desired item_instance_uuid;
         * Use 'getSlotByItemInstanceUUID' instead
         *
         * @param {String} item_instance_uud
         * @deprecated
         * @return {Object|null}
         */
        this.getItemInstanceByUUID = function (item_instance_uud) {
            var i;
            for (i = 0; i < this.size; i += 1) {
                var slot = this.slots[i];
                if (slot !== null && slot.item_instance !== null && slot.item_instance.item_instance_uuid === item_instance_uud) {
                    return slot;
                }
            }

            return null;
        };

        /**
         * Get a slot by item instance uuid
         * @param {String} item_instance_uud
         * @returns {Object|null}
         */
        this.getSlotByItemInstanceUUID = function (item_instance_uud) {
            return this.getItemInstanceByUUID(item_instance_uud);
        }
    };

    /**
     * Batch model that contains randomly generated items
     */
    exports.BatchModel = function () {
        this.ttl = null;            // {Number} Time to live ( seconds )
        this.player_id = null;      // {Number} Unique player's id that requested the batch
        this.created_at = null;     // {Date} when the batch was created
        this.isExpired = false;     // {Boolean} true if batch is expired. This value is set by anonymous setTimeout
        this.batch_uuid = null;     // {String}
        this.item_instances = null; // {Array}
        this.totalItems = null;     // {Number}

        this._timeoutId = null;     // {Number} id of the timeout to set batch expired
        /**
         * Destructor to clear all data;
         */
        this.onDestroy = function () {

            // clear timeout function
            if (this._timeoutId !== null) {
                clearTimeout(this._timeoutId);
                this._timeoutId = null;
            }

            require("data").destroy(this);
        };

        /**
         * Set batch model;
         * todo: make test when users changes his time and so on...
         *
         * @param {Object} response_message
         */
        this.setBatch = function (response_message) {
            this.ttl = parseInt(response_message.ttl, 10);
            this.player_id = response_message.player_id;
            this.created_at = new Date(response_message.created_at);
            this.batch_uuid = response_message.batch_uuid;
            this.item_instances = response_message.item_instances;
            this.totalItems = response_message.item_instances !== null ? response_message.item_instances.length : 0;

            // set timeout to mark batch as expired.
            // it is not accurate, as there could be a server lag and we can get data
            var scope = this;
            this._timeoutId = setTimeout(function () {
                if (scope !== null) {
                    scope.isExpired = true;
                    scope._timeoutId = null;
                }
            }, this.ttl * 1000);
        };

        /**
         * Return a random item instance from the batch;
         *
         * @return {Object}
         */
        this.getRandomItem = function () {
            if (this.item_instances === null || this.totalItems === 0) {
                return null;
            }

            var items_array = [], i;
            for (i = 0; i < this.item_instances.length; i += 1) {
                if (this.item_instances[i] !== null) {
                    items_array.push(this.item_instances[i]);
                }
            }

            // search for any normal item;
            if (items_array.length.totalItems === 1) {
                return items_array[0];
            } else {
                return items_array[Math.floor(Math.random() * items_array.length)];
            }
        };

        /**
         * Get an item instance by index;
         *
         * @param {Number} index is actual position in the array
         * @return {Object|null}
         */
        this.getItemAtIndex = function (index) {

            index = parseInt(index, 10);
            if (this.item_instances !== null && this.item_instances[index] !== null) {
                return this.item_instances[index];
            }

            return null;
        };

        /**
         * Releases ( find and removes ) item by item_instance_uuid;
         *
         * @param {String} item_instance_uuid
         * @return {Object|null}
         */
        this.releaseItemByUUID = function (item_instance_uuid) {
            var i;
            for (i = 0; i < this.item_instances.length; i += 1) {
                var item = this.item_instances[i];
                if (item && item.item_instance_uuid === item_instance_uuid) {
                    this.removeItemAtIndex(i);
                    return item;
                }
            }

            return null;
        };

        /**
         * Delete an item instance at specified index;
         *
         * @param {Number} index
         *
         */
        this.removeItemAtIndex = function (index) {
            index = parseInt(index, 10);
            if (this.item_instances !== null && this.item_instances[index] !== null) {

                var total = 0, i;
                for (i = 0; i < this.item_instances.length; i += 1) {
                    if (this.item_instances[i] !== null) {
                        this.totalItems += 1;
                    }
                }

                this.totalItems = total;
                this.item_instances[index] = null;

                snog_dispatcher.b(Snog.events.BATCH_CHANGED, this);
            }
        };
    };

    /**
     * Collection of different Batch models;
     */
    exports.BatchModels = function () {
        this.batches = {};          // {Hash} key = batch uuid, value = BatchModel
        this.last_batch_uuid = "";  // {String} uuid of the last set batch

        /**
         * Destructor of all batches;
         */
        this.onDestroy = function () {
            var uuid;
            for (uuid in this.batches) {
                if (this.batches.hasOwnProperty(uuid)) {
                    try {
                        this.batches[uuid].onDestroy();
                    } catch (error) {
                    }
                }
            }

            this.last_batch_uuid = "";
            this.batches = {};
        };

        /**
         * Add a new batch;
         * @param response_message
         */
        this.addBatch = function (response_message) {
            if (response_message === null) {
                Snog.error("Try to add null batch");
            }

            var model = new exports.BatchModel();
            model.setBatch(response_message);

            this.batches[model.batch_uuid] = model;
            this.last_batch_uuid = model.batch_uuid;

            // send event;
            snog_dispatcher.b(Snog.events.BATCH_CHANGED, model);
        };

        /**
         * Get a batch by uuid;
         * @param {String} batch_uuid
         * @return {BatchModel|null}
         */
        this.getBatchByUUID = function (batch_uuid) {
            if (this.batches.hasOwnProperty(batch_uuid)) {
                return this.batches[batch_uuid];
            }

            return null;
        };

        /**
         * Remove a batch by uuid;
         * @param {String} batch_uuid
         */
        this.removeBatchByUUID = function (batch_uuid) {
            if (this.last_batch_uuid === batch_uuid) {
                this.last_batch_uuid = "";
            }
            if (this.batches.hasOwnProperty(batch_uuid)) {
                delete this.batches[batch_uuid];
            } else {
                Snog.error("Try to remove null batch");
            }
        };

        /**
         * Method that removes all expired batches from the hash
         */
        this.removeExpiredBatches = function () {
            for (var batch_uuid in this.batches) {
                if (this.batches.hasOwnProperty(batch_uuid)) {
                    var batch_model = this.batches[ batch_uuid ];
                    if (batch_model.isExpired) {
                        this.removeBatchByUUID(batch_model.batch_uuid);
                    }
                }
            }
        }
    };

    /**
     * Model of In Game Messages (IGM);
     */
    exports.IGMFolderModel = function () {
        this.messages = null;   // {Array} of messages got from the server;
        this.event = null;      // {String} Payload event that will be sent on message changed,
        // normally INBOX_MESSAGES_CHANGED || OUTBOX_MESSAGES_CHANGED
        this.page_size = null;  // {Number} total messages per page
        this.page_index = null; // {Number} current page

        /**
         * Destructor to clear all data;
         */
        this.onDestroy = function () {
            require("data").destroy(this);
        };

        /**
         * Set messages;
         * @param {Array} messages
         */
        this.setMessages = function (messages) {
            this.messages = messages;
        };

        /**
         * Get message by id;
         *
         * @param {String} igm_id
         * @return {Object|null}
         */
        this.getMessageByID = function (igm_id) {
            if (this.messages !== null) {
                var i;
                for (i = 0; i < this.messages.length; i += 1) {
                    var msg = this.messages[i];
                    if (msg && msg.igm_id === igm_id) {
                        return msg;
                    }
                }
            }

            return null;
        };

        /**
         * Get message by title;
         *
         * @param title
         * @return {Object|null}
         */
        this.getMessageByTitle = function (title) {
            if (this.messages !== null) {
                var i;
                for (i = 0; i < this.messages.length; i += 1) {
                    var msg = this.messages[i];
                    if (msg && msg.title === title) {
                        return msg;
                    }
                }
            }

            return null;
        };

        /**
         * Update message data;
         * @param {Object} message
         */
        this.updateMessage = function (message) {
            var msg = this.getMessageByID(message.igm_id);
            if (msg) {
                msg.view = message.view;                  // update view ( changes from 'short' to 'full' );
                msg.igm_entries = message.igm_entries;    // update igm entries;
                msg.status = "R";                         // manually set status as read;
                snog_dispatcher.b(Snog.events.MESSAGE_CHANGED, msg);

                // send event to update messages;
                if (this.event !== null) {
                    snog_dispatcher.b(this.event, this.messages);
                }
            }
        };

        /**
         * Delete message by ID;
         * @param {String} igm_id
         * @return {Boolean}
         */
        this.deleteMessageByID = function (igm_id) {
            if (this.messages !== null) {
                var i;
                for (i = 0; i < this.messages.length; i += 1) {
                    var msg = this.messages[i];
                    if (msg && msg.igm_id === igm_id) {
                        this.messages.splice(i, 1);
                        snog_dispatcher.b(Snog.events.MESSAGE_DELETED, msg);

                        // send event to update messages;
                        if (this.event !== null) {
                            snog_dispatcher.b(this.event, this.messages);
                        }
                        return true;
                    }
                }
            }

            return false;
        };

        /**
         * Add a reply into message igm_entries.
         * There could be a server delay, so reply will be added into message entries array, but it could take time.
         * So, manually put this data without server synchronization.
         *
         * todo: write stress tests for reply igm
         *
         * @param {String} igm_id
         * @param {Object} request
         */
        this.updateReply = function (igm_id, request) {
            var data = require("data");
            // add reply into message body;
            var original_message = data.player_messages.getMessageByID(igm_id);
            if (original_message !== null && original_message.type !== "short") {
                // add reply into entries;
                var reply = {};
                reply.body = request.body;

                // fix message direction. As we may reply to outbox message;
                if (original_message.to_player_id === data.player_id) {
                    reply.from_player_id = original_message.to_player_id;
                    reply.to_player_id = original_message.from_player_id;
                } else {
                    reply.to_player_id = original_message.to_player_id;
                    reply.from_player_id = original_message.from_player_id;
                }

                reply.message_type = "igm_entry";

                var date = new Date();
                var month = date.getMonth() + 1;
                reply.time_created = date.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + date.getDate();

                original_message.igm_entries.push(reply);

                // send event that message has been changed;
                snog_dispatcher.b(Snog.events.MESSAGE_CHANGED, original_message);

                // send event to update messages;
                if (this.event !== null) {
                    snog_dispatcher.b(this.event, this.messages);
                }
            }
        };
    };

    /**
     * Players' profile models;
     */
    exports.PlayersProfilesModel = function () {
        this.players_models = {};   // {Object} key = player_id, value = PlayerProfileModel

        /**
         * Destructor to clear all data;
         */
        this.onDestroy = function () {
            var id;
            for (id in this.players_models) {
                if (this.players_models.hasOwnProperty(id)) {
                    this.players_models[id].onDestroy();
                }
            }

            this.players_models = {};
        };

        /**
         * Get player's profile model;
         *
         * @param {Number} player_id
         * @return {PlayerProfileModel|null}
         */
        this.getPlayerProfileByID = function (player_id) {
            player_id = parseInt(player_id, 10);
            if (player_id === require("data").player_id) {
                return require("data").getProfile();
            }

            var key = player_id.toString();
            if (!this.players_models.hasOwnProperty(key)) {
                this.players_models[key] = new exports.PlayerProfileModel();
                return this.players_models[key];
            }

            return this.players_models[key];
        };

        /**
         * Set player model;
         * @param {PlayerProfileModel} model
         */
        this.setPlayerModel = function (model) {
            var key = model['player_id'].toString();
            this.players_models[key] = model;

            snog_dispatcher.b(Snog.events.PROFILES_CHANGED, this);
        };

        /**
         * Set a list of profiles;
         * @param {Array} profiles_array
         */
        this.setProfiles = function (profiles_array) {
            if (profiles_array !== undefined && profiles_array !== null && profiles_array.length > 0) {
                var i;
                for (i = 0; i < profiles_array.length; i += 1) {
                    var profile = profiles_array[i];
                    var model = this.getPlayerProfileByID(profile.player_id);

                    // set profile in any case, only if it is loading skip it
                    // todo: there is a chance to override profile...
                    if (!model.isLoading) {
                        model.setProfile(profile);
                    }
                }
            } else {
                Snog.error("Try to set null profiles");
            }
        };
    };

    /**
     *  Players boards model;
     */
    exports.PlayersBoardsModel = function () {
        this.boards = null;      //(Object) hash, were key = player_id and value = PlayerBoardsModel;

        /**
         * Clear all data;
         */
        this.onDestroy = function () {
            require("data").destroy(this);
        };

        /**
         * Return BoardsModel for the desired player;
         * @param {Number} player_id
         * @return {PlayerBoardsModel|null} ;
         */
        this.getPlayerBoards = function (player_id) {
            if (this.boards === null) {
                this.boards = {};
            }

            if (!this.boards.hasOwnProperty(player_id)) {
                this.boards[player_id] = new exports.PlayerBoardsModel();
                this.boards[player_id].player_id = player_id;
            }

            return this.boards[player_id];
        };
    };

    /**
     * Leaders models;
     */
    exports.PlayersLeadersModel = function () {
        this.leaders_hash = null;   //(Object) hash, key = type, value = array of leaders

        /**
         * Clear all data;
         */
        this.onDestroy = function () {
            require("data").destroy(this);
        };

        /**
         * Set leaders by type;
         * @param type ( Array ) [day,week,month,all_time]
         * @param filter ( optional )
         * @param board_ref ( optional )
         * @param response_message
         */
        this.setLeaders = function (type, filter, board_ref, response_message) {
            var error = null;
            if (type === null || type === undefined) {
                Snog.error("Leaderboard type is null");
            }

            if (response_message === null || response_message === undefined) {
                Snog.error("Try to set leaderboard = null");
            }

            if (this.leaders_hash === null) {
                this.leaders_hash = {};
            }

            if (!this.leaders_hash.hasOwnProperty(type)) {
                this.leaders_hash[type] = {};
            }

            // redefine filter
            if (filter === undefined) {
                filter = "_general_";
            }

            if (!this.leaders_hash[type].hasOwnProperty(filter)) {
                this.leaders_hash[type][filter] = {};
            }

            // redefine boardRef
            if (board_ref === undefined) {
                board_ref = "_all_";
            }

            if (!this.leaders_hash[type][filter].hasOwnProperty(board_ref)) {
                this.leaders_hash[type][filter][board_ref] = {};
            }

            this.leaders_hash[type][filter][board_ref] = response_message;
            snog_dispatcher.b(Snog.events.LEADERS_CHANGED, { type: type, rows: response_message.rows, filter: filter, board_ref: board_ref  });
        };

        /**
         * Return array of leaders;
         * @param {String} type
         * @param {String} filter ( optional )
         * @param {String} board_ref ( optional )
         */
        this.getLeaders = function (type, filter, board_ref) {
            if (type === null || type === undefined) {
                Snog.error("leaderboard type is null");
            }

            if (this.leaders_hash === null) {
                return null;
            }

            // redefine filter
            if (filter === undefined) {
                filter = "_general_";
            }

            // redefine boardRef
            if (board_ref === undefined) {
                board_ref = "_all_";
            }

            var leaders = null;
            try {
                leaders = this.leaders_hash[type][filter][board_ref];
            } catch (e) {
            }

            return leaders;
        };
    };

    /**
     * Items model
     */
    exports.ItemsModel = function () {
        this.instances_hash = null;   // (Object) Hash of item instances, key = item_instance_uud, value = object;
        this.items_hash = null;       // (Object) Hash of items;

        /**
         * Destructor to clear all data;
         */
        this.onDestroy = function () {
            require("data").destroy(this);
        };

        /**
         * Add item instance;
         * @param {Object} response_message
         */
        this.addItemInstance = function (response_message) {
            if (this.instances_hash === null) {
                this.instances_hash = {};
            }

            this.instances_hash[response_message.item_instance_uuid] = response_message;
            snog_dispatcher.b(Snog.events.ITEM_INSTANCE_CHANGED, response_message);
        };

        /**
         * Get item instance;
         * @param {String} item_instance_uuid
         * @return {Object|null}
         */
        this.getItemInstanceByUUID = function (item_instance_uuid) {
            if (this.instances_hash === null) {
                return null;
            }

            if (this.instances_hash.hasOwnProperty(item_instance_uuid)) {
                return this.instances_hash[item_instance_uuid];
            }
            return null;
        };

        /**
         * Store item description;
         * @param {Object} response_message
         */
        this.updateItem = function (response_message) {
            if (this.items_hash === null) {
                this.items_hash = {};
            }

            this.items_hash[response_message.item_ref] = response_message;
            snog_dispatcher.b(Snog.events.ITEM_CHANGED, response_message);
        };

        /**
         * Get item by ref;
         * @param {String} ref
         * @return {Object|null}
         */
        this.getItemByRef = function (ref) {
            return this.items_hash === null ? null : this.items_hash[ref];
        };
    };

    /**
     * Milestones model
     * @constructor
     */
    exports.PlayerMilestonesModel = function () {
        this.milestones = null; // {Array} of milestone objects

        /**
         * Destructor to clear all data;
         */
        this.onDestroy = function () {
            require("data").destroy(this);
        };

        /**
         * Set milestones
         * @param {Array} response_message
         */
        this.setMilestonesList = function (response_message) {

            // create a new array of milestones;
            if (response_message !== null && response_message.milestones.length > 0) {
                this.milestones = response_message.milestones;
            } else {
                this.milestones = null;
            }

            snog_dispatcher.b(Snog.events.MILESTONES_CHANGED, this.milestones);
        };

        /**
         * Return a list of milestones
         * @returns {Array|null}
         */
        this.getMilestonesList = function () {
            return this.milestones;
        };

        /**
         * Set a single milestone message
         * @param {Object} response_message
         */
        this.setMilestone = function (response_message) {
            if (this.milestones !== null && this.milestones.length > 0) {

                // update existing message
                var i, isUpdated = false;
                for (i = 0; i < this.milestones.length; i += 1) {
                    var milestone_obj = this.milestones[i];
                    if (milestone_obj.milestone_ref === response_message.milestone_ref) {
                        this.milestones[i] = response_message;
                        isUpdated = true;
                        break;
                    }
                }

                // add new milestone message;
                if (!isUpdated) {
                    this.milestones.push(response_message);
                }

                snog_dispatcher.b(Snog.events.MILESTONE_CHANGED, response_message);
            }
        };

        /**
         * Get a milestone by ref;
         *
         * @param {String} milestone_ref
         * @return {Object|null}
         */
        this.getMilestoneByRef = function (milestone_ref) {
            if (this.milestones !== null && this.milestones.length > 0) {
                var i;
                for (i = 0; i < this.milestones.length; i += 1) {
                    var milestone_obj = this.milestones[i];
                    if (milestone_obj.milestone_ref === milestone_ref) {
                        return milestone_obj;
                    }
                }
            }

            return null;
        };

        /**
         * Get a milestone step by ref
         * @param milestone_ref
         * @param step_ref
         * @returns {*}
         */
        this.getMilestoneStepByRef = function (milestone_ref, step_ref) {
            var milestone = this.getMilestoneByRef(milestone_ref);

            if (milestone && milestone.steps !== null) {
                var i;
                for (i = 0; i < milestone.steps.length; i++) {
                    var step = milestone.steps[i];
                    if (step.step_ref === step_ref) {
                        return step;
                    }
                }
            }

            return null;
        };
    };

    //--------------------------------------------------------------------------------------------
    // Models that are related to the current player
    //--------------------------------------------------------------------------------------------

    /**
     * Player's messages model;
     * Player has inbox and outbox models.
     */
    exports.PlayerMessagesModel = function () {
        this.inboxMessages = new exports.IGMFolderModel();
        this.inboxMessages.event = Snog.events.INBOX_MESSAGES_CHANGED;

        this.outboxMessages = new exports.IGMFolderModel();
        this.outboxMessages.event = Snog.events.OUTBOX_MESSAGES_CHANGED;

        /**
         * Destructor to clear all data;
         */
        this.onDestroy = function () {
            this.inboxMessages.onDestroy();
            this.outboxMessages.onDestroy();
        };

        /**
         * Set inbox messages;
         * @param {Object} response_message
         */
        this.setInbox = function (response_message) {
            this.inboxMessages.setMessages(response_message.igms);
            snog_dispatcher.b(Snog.events.INBOX_MESSAGES_CHANGED, this.inboxMessages.messages);
        };

        /**
         * Set outbox messages
         * @param {Object} response_message
         */
        this.setOutbox = function (response_message) {
            this.outboxMessages.setMessages(response_message.igms);
            snog_dispatcher.b(Snog.events.OUTBOX_MESSAGES_CHANGED, this.outboxMessages.messages);
        };

        /**
         * Update message;
         * Automatically check inbox and then outbox;
         *
         * @param {Object} msg
         */
        this.updateMessage = function (msg) {
            var message = this.inboxMessages.getMessageByID(msg.igm_id);
            if (message !== null) {
                // update message from inbox;
                this.inboxMessages.updateMessage(msg);
            } else {
                // update message from outbox;
                this.outboxMessages.updateMessage(msg);
            }
        };

        /**
         * Find a message by id from either inbox or outbox;
         * @param {String} igm_id
         * @return {Object|null}
         */
        this.getMessageByID = function (igm_id) {
            var result = this.inboxMessages.getMessageByID(igm_id);
            if (result === null) {
                result = this.outboxMessages.getMessageByID(igm_id);
            }

            return result;
        };

        /**
         * Find a message by title from either inbox or outbox;
         * @param {String} title
         * @return {Object|null}
         */
        this.getMessageByTitle = function (title) {
            var result = this.inboxMessages.getMessageByTitle(title);
            if (result === null) {
                result = this.outboxMessages.getMessageByTitle(title);
            }

            return result;
        };
    };

    /**
     * Player Friends Model;
     */
    exports.PlayerFriendsModel = function () {
        this.friends = null;     // {Array} of the friends
        this.player_id = null;   // {Number} unique player id
        this.isLoaded = false;   // {Boolean} flag that indicated if friends were loaded

        /**
         * Destructor to clear all data;
         */
        this.onDestroy = function () {
            require("data").destroy(this);
        };

        /**
         * Set friends;
         * @param {Object} response_message
         */
        this.setFriends = function (response_message) {
            this.isLoaded = true;
            this.player_id = response_message.player_id;
            this.friends = response_message.friends;

            snog_dispatcher.b(Snog.events.FRIENDS_CHANGED, this);
        };
    };

    /**
     * Player's rewards model;
     */
    exports.PlayerRewardsModel = function () {
        this.rewards = null;            // {Array} of reward models
        this.reward_instances = null;   // {Array} of reward instance models

        /**
         * Destructor to clear all data;
         */
        this.onDestroy = function () {
            require("data").destroy(this);
        };

        /**
         * Set rewards
         * @param {Object} response_message
         */
        this.setRewards = function (response_message) {
            this.rewards = response_message.rewards;
            snog_dispatcher.b(Snog.events.REWARDS_CHANGED, this.rewards);
        };

        /**
         * Set reward instances owned by player;
         * @param {Object} response_message
         */
        this.setRewardInstances = function (response_message) {
            this.reward_instances = response_message.reward_instances;
            snog_dispatcher.b(Snog.events.REWARD_INSTANCES_CHANGED, this.reward_instances);
        };

        /**
         * Check if there are any reward instances
         * @returns {boolean}
         */
        this.hasRewardInstances = function() {
            return this.reward_instances !== null && this.reward_instances.length > 0;
        }
    };

    /**
     * Player's status model;
     * @constructor
     */
    exports.PlayerStatusModel = function() {
        this.player_id = null;
        this.inbox_size = 0;
        this.unread_messages = 0;
        this.outbox_size = 0;
        this.points = 0;
        this.level = 0;
        this.account_balances = [];
        this.timestamp = 0;

        /**
         * Set status;
         * Mind that timestamp could be the different and user may get old messages;
         *
         * @param response_message
         */
        this.setStatus = function( response_message ) {
            var timestamp = new Date(response_message.timestamp).getTime();

            // update only if status message is newer
            if ( this.timestamp < timestamp )
            {
                this.player_id = parseInt( response_message.player_id, 10 );
                this.inbox_size = parseInt( response_message.inbox_size, 10 );
                this.unread_messages = parseInt( response_message.unread_messages, 10 );
                this.outbox_size = parseInt( response_message.outbox_size, 10 );
                this.points = parseInt( response_message.points, 10 );
                this.level = parseInt( response_message.level, 10 );
                this.account_balances = response_message.account_balances;
                this.timestamp = timestamp;

                snog_dispatcher.b(Snog.events.PLAYER_STATUS_CHANGED, this);
            }
        };

        /**
         * Return balance by type
         * @type {int|null}
         */
        this.getBalanceByType = function(type) {
            if ( this.account_balances !== null && this.account_balances.length > 0) {
                for( var i = 0; i < this.account_balances.length; i++ ) {
                    if ( this.account_balances[i].type === type ) {
                        return this.account_balances[i].balance;
                    }
                }
            }

            return null;
        }
    };

    /**
     * Player's profile model;
     */
    exports.PlayerProfileModel = function () {
        this.player_id = null;            // {Number} unique player id (read-only)
        this.avatar_uri = null;           // {String} avatar uri
        this.birth_day = null;            // {Number} day of birth;
        this.birth_month = null;          // {Number} month of birth;
        this.birth_year = null;           // {Number} year of birth;
        this.city = null;                 // {String} city
        this.country_code = null;         // {String} country code;
        this.email = null;                // {String} player's email;
        this.email_notifications = false; // {Boolean} receive email notifications
        this.email_validated = false;     // {Boolean} true if user confirmed his/her email address (read-only)
        this.first_name = null;           // {String} first name of the player;
        this.friend_name = null;          // {String}
        this.gender = null;               // {String} gender of the player (M|F)
        this.jurisdiction = null;         // {String} province
        this.last_name = null;            // {String} last name of the player
        this.level = null;                // {Number} current player's level (read-only)
        this.name = null;                 // {String} name of the player
        this.points = null;               // {Number} total amount of points that has player (read-only)
        this.privacy = false;             // {Boolean}
        this.profile_incomplete = false;  // {Boolean} flag that indicates that player has his profile incomplete (read-only)
        this.public_name = null;          // {String} name that is visible for other players (read-only)
        this.type = null;                 // {String} friend | stranger indicated if this player is a friend or stranger to the current user
        this.realm = null;                // {String} External authentication realm in which this profile has been identified (optional).
        this.realm_id = null;             // {String} ID of the player in another authentication realm (optional).
        this.isLoading = false;           // {Boolean}
        this.isLoaded = false;            // {Boolean}

        /**
         * Destructor to clear all data;
         */
        this.onDestroy = function () {
            require("data").destroy(this);
        };

        /**
         * Set player's profile
         * @param {Object} response_message
         */
        this.setProfile = function (response_message) {
            this.isLoading = false;
            this.isLoaded = true;

            var prop;
            for (prop in response_message) {
                if (response_message.hasOwnProperty(prop) && this.hasOwnProperty(prop)) {
                    this[prop] = response_message[prop];
                }
            }

            snog_dispatcher.b(Snog.events.PROFILE_CHANGED, this);
        };

        /**
         * Update player's avatar uri
         * Current player can update only his/her avatar
         *
         * @param {String} uri
         */
        this.updateAvatar = function (uri) {
            this.avatar_uri = uri;
            snog_dispatcher.b(Snog.events.PROFILE_CHANGED, this);
        };
    };

    /**
     * Player boards model;
     */
    exports.PlayerBoardsModel = function () {
        this.player_id = null;      // {Number}
        this.boards = null;         // {Array} of board that have description and so on
        this.board_slots = null;    // {Array} of existing slots that have board instance
        this.bags = null;           // {Array}

        /**
         * Destructor to clear all data;
         */
        this.onDestroy = function () {
            require("data").destroy(this);
        };

        /**
         * Set boards;
         *
         * @param {Array} response_message
         */
        this.setBoardList = function (response_message) {
            this.boards = response_message.boards;
            snog_dispatcher.b(Snog.events.BOARDS_CHANGED, { player_id: this.player_id, boards: this.boards });
        };

        /**
         * Get board instance slot by ID;
         * @param board_instance_id
         * @return {Object|null}
         */
        this.getBoardInstanceSlotByID = function (board_instance_id) {
            if (this.board_slots !== null) {
                if (this.board_slots.length > 0) {
                    var i;
                    for (i = 0; i < this.board_slots.length; i += 1) {
                        var board_slot = this.board_slots[i];
                        if (board_slot.board_instance !== null && board_slot.board_instance.board_instance_id === board_instance_id) {
                            return board_slot;
                        }
                    }
                }
            }

            return null;
        };

        /**
         * Set board instances array
         *
         * @param {Object} response_message
         */
        this.setBoardInstanceSlotList = function (response_message) {
            this.board_slots = response_message.slots;
            snog_dispatcher.b(Snog.events.BOARD_SLOTS_CHANGED, { player_id: this.player_id, board_slots: this.board_slots});
        };

        /**
         * Update board instance;
         * @param {Object} response_message
         */
        this.updateBoardInstance = function (response_message) {
            if (this.board_slots !== undefined && this.board_slots.length > 0) {
                var i;
                for (i = 0; i < this.board_slots.length; i += 1) {
                    var board_slot = this.board_slots[i];
                    if (board_slot.board_instance.board_instance_id === response_message.board_instance_id) {
                        this.board_slots[i].board_instance = response_message;
                        snog_dispatcher.b(Snog.events.BOARD_INSTANCE_CHANGED, { player_id: this.player_id, board_slot: board_slot});
                        return;
                    }
                }

                Snog.error("Board instance not found");
            }
        };

        /**
         * Update board comment;
         * @param {Number} board_instance_id
         * @param {String} comment
         */
        this.updateBoardInstanceComment = function (board_instance_id, comment) {
            if (this.board_slots !== undefined && this.board_slots.length > 0) {
                var i;
                for (i = 0; i < this.board_slots.length; i += 1) {
                    var board_slot = this.board_slots[i];
                    if (board_slot.board_instance.board_instance_id === board_instance_id) {
                        this.board_slots[i].board_instance.comment = comment;
                        snog_dispatcher.b(Snog.events.BOARD_INSTANCE_CHANGED, { player_id: this.player_id, board_slot: board_slot});
                        return;
                    }
                }

                Snog.error("Board instance not found, comment has not been updated");
            }
        };

        /**
         * Create a new board instance and add it to board_instances array;
         * @param {Object} response_message
         */
        this.createBoardInstance = function (response_message) {
            var board_slot = { empty: true, locked: false, board_instance: response_message };
            if (this.board_slots === null) {
                this.board_slots = [];
            }

            this.board_slots.push(board_slot);
            snog_dispatcher.b(Snog.events.BOARD_SLOTS_CHANGED, { player_id: this.player_id, board_slots: this.board_slots});
        };

        /**
         * Delete a single board instance;
         * @param {Number} board_instance_id
         * @return {Boolean}
         */
        this.deleteBoardInstanceSlotByID = function (board_instance_id) {
            var i;
            for (i = 0; i < this.board_slots.length; i += 1) {
                var instance = this.board_slots[i];
                if (instance !== null && instance.board_instance !== null && instance.board_instance.board_instance_id === board_instance_id) {
                    this.board_slots.splice(i, 1);
                    snog_dispatcher.b(Snog.events.BOARD_SLOTS_CHANGED, { player_id: this.player_id, board_slots: this.board_slots});
                    return true;
                }
            }

            return false;
        };

        /**
         * Lock board instance by id;
         * @param {Number} board_instance_id
         */
        this.lockBoardInstanceSlotByID = function (board_instance_id) {
            var board_slot = this.getBoardSlotByBoardInstanceID(board_instance_id);
            if (board_slot !== null) {
                board_slot.locked = true;
                snog_dispatcher.b(Snog.events.BOARD_INSTANCE_CHANGED, { player_id: this.player_id, board_slot: board_slot});
            }
        };

        /**
         * Unlock board instance by id;
         * @param {Number} board_instance_id
         */
        this.unlockBoardInstanceSlotByID = function (board_instance_id) {
            var board_slot = this.getBoardSlotByBoardInstanceID(board_instance_id);
            if (board_slot !== null) {
                board_slot.locked = false;
                snog_dispatcher.b(Snog.events.BOARD_INSTANCE_CHANGED, { player_id: this.player_id, board_slot: board_slot});
            }
        };

        /**
         * Get board instance by bag id;
         * @param {Number} bag_id
         * @return {Object|null} board_instance;
         */
        this.getBoardInstanceByBagID = function (bag_id) {
            if (this.board_slots === null) {
                return null;
            }

            var i;
            for (i = 0; i < this.board_slots.length; i += 1) {
                var board_slot = this.board_slots[i];
                if (board_slot !== null && board_slot.board_instance !== null && board_slot.board_instance.bag_id === bag_id) {
                    return board_slot.board_instance;
                }
            }

            return null;
        };

        /**
         * Set board instance bag
         * @param {Object} response_message
         * @param {Number} player_id
         */
        this.setBag = function (response_message, player_id) {
            if (this.bags === null) {
                this.bags = {};
            }

            if (!this.bags.hasOwnProperty(response_message.bag_id)) {
                this.bags[response_message.bag_id] = new exports.BagModel();
                this.bags[response_message.bag_id].player_id = player_id;
            }

            this.bags[response_message.bag_id].setBag(response_message);
        };

        /**
         * Return bag by id;
         * @param {Number} bag_id
         * @return {BagModel|null};
         */

        this.getBagByID = function (bag_id) {
            var data = require("data");
            if (data.isInventory(bag_id)) {
                return data.player_inventory;
            }

            if (this.bags === null) {
                return null;
            }

            return this.bags.hasOwnProperty(bag_id) ? this.bags[bag_id] : null;
        };

        /**
         * Get board instances by board ref
         * @param {String} board_ref
         * @return {Array|null};
         */
        this.getBoardInstancesByBoardRef = function (board_ref) {
            if (this.board_slots !== null && this.board_slots.length > 0) {
                var result = [], i;
                for (i = 0; i < this.board_slots.length; i += 1) {
                    var board_slot = this.board_slots[i];
                    if (board_slot.board_instance !== null && board_slot.board_instance.board_ref === board_ref) {
                        result.push(board_slot);
                    }
                }

                return result;
            }

            return null;
        };

        /**
         * Find board slot by board instance id;
         * @param {Number} board_instance_id
         */
        this.getBoardSlotByBoardInstanceID = function (board_instance_id) {
            if (this.board_slots !== null && this.board_slots.length > 0) {
                var i;
                for (i = 0; i < this.board_slots.length; i += 1) {
                    var board_slot = this.board_slots[i];
                    if (board_slot.board_instance !== null && board_slot.board_instance.board_instance_id === board_instance_id) {
                        return board_slot;
                    }
                }
            }

            return null;
        };

        /**
         * Find board by unique reference;
         * @param {String} board_ref
         * @return {Object|null}
         */
        this.getBoardByRef = function (board_ref) {
            if (board_ref === null) {
                return null;
            }

            if (this.boards !== null && this.boards.length > 0) {
                var i;
                for (i = 0; i < this.boards.length; i += 1) {
                    var b = this.boards[i];
                    if (b.board_ref === board_ref) {
                        return b;
                    }
                }
            }

            return null;

        };
    };

    /**
     * Compatibility results model;
     */
    exports.PlayerCompatibilityModel = function () {
        this.target = null;     // {Object}
        this.matches = null;    // {Array}
        this.points = 0;        // {Number}

        /**
         * Destructor to clear all data;
         */
        this.onDestroy = function () {
            require("data").destroy(this);

            this.points = 0;
        };

        /**
         * Set compatibility results;
         * @param {Object} response_message
         */
        this.setResults = function (response_message) {
            this.matches = response_message.matches;
            this.target = response_message.target;
            this.points = response_message.points;

            snog_dispatcher.b(Snog.events.COMPATIBILITY_CHANGED, { matches: this.matches, target: this.target, points: this.points });
        };
    };

    exports.PreferencesModel = function () {
        this.preferences_by_player_id = {};   // {Object} hash of

        this.set = function (response) {

            if (!this.preferences_by_player_id.hasOwnProperty(response.player_id)) {
                this.preferences_by_player_id[response.player_id] = new exports.PreferenceModel();
            }

            this.preferences_by_player_id[response.player_id].set(response);
        };

        this.get = function (player_id, key) {
            if (this.preferences_by_player_id.hasOwnProperty(player_id)) {
                return this.preferences_by_player_id[player_id].get(key);
            }

            return null;
        }
    };

    exports.PreferenceModel = function () {
        this.hash = {};

        this.set = function( preference ) {
            this.hash[preference.key] = preference;

            snog_dispatcher.b(Snog.events.PREFERENCE_CHANGED, preference);
        };

        this.get = function(key) {
            return this.hash.hasOwnProperty(key) ? this.hash[key] : null;
        }
    }
});/**
 * Data module contains all user data that is loaded from the server;
 * Used to synchronize and store player's data and broadcasting change events;
 */
Snog.define("data", function (require, exports, module) {
    "use strict";

    var models = require("models");

    module.exports = {
        auth_type            : null,  // {String} type of the authorization that is used on signup ( recapcha | yah )
        fe_api_url           : null,  // {String} unique front end server API URL;
        keepUserLoggedIn     : true,  // {Boolean} if true, AUTO_LOGIN will connect automatically;
        uploader_url         : null,  // {String} url that is used to upload data
        uploader_realm       : null,  // {String} unique type of the realm, needed for the uploader
        auth_token           : null,  // {String} authorization token, generated by server side
        temp_avatar_uri      : null,  // {String} temporary avatar uri, that is used before CDN on avatar update.

        player_id            : null,                                    // {Number} current player's id
        player_email         : null,                                    // {String} current player's email
        player_inventory     : new models.BagModel(),                   // current player's inventory
        player_profile       : new models.PlayerProfileModel(),         // current player's protextfile
        player_messages      : new models.PlayerMessagesModel(),        // current player's inbox and outbox
        player_friends       : new models.PlayerFriendsModel(),         // current player's friends
        player_rewards       : new models.PlayerRewardsModel(),         // current player's rewards
        player_compatibility : new models.PlayerCompatibilityModel(),   // current player's compatibility results
        player_milestones    : new models.PlayerMilestonesModel(),      // current player's milestones
        player_status        : new models.PlayerStatusModel(),          // current player's status;
        batches              : new models.BatchModels(),                // all requested batches
        profiles             : new models.PlayersProfilesModel(),       // different players profiles
        boards               : new models.PlayersBoardsModel(),         // diffirent players boards
        leaders              : new models.PlayersLeadersModel(),        // leaderboards
        items                : new models.ItemsModel(),                 // items and item instances
        preferences          : new models.PreferencesModel(),           // unique preferences

        /**
         * Clear old data;
         */
        onDestroy : function () {
            var prop, type;
            for (prop in this) {
                if(this.hasOwnProperty(prop)) {
                    type = typeof (this[prop]);
                    if(type === "object") {
                        try {
                            this[prop].onDestroy();
                        } catch (err) {

                            // Skip front end API URL, and keep user login flag;
                            if(prop !== "fe_api_url" || prop !== "keepUserLoggedIn") {
                                this[prop] = null;
                            }
                        }
                    } else {
                        if(type === "boolean") {
                            this[prop] = false;
                        }
                    }
                }
            }
        },

        //--------------------------------------------------------------------------------------------
        // Getters
        //--------------------------------------------------------------------------------------------

        /**
         * Get current player id;
         * @return {Number}
         */
        getPlayerID : function () {
            if(this.player_profile) {
                return this.player_profile.player_id;
            }
            return this.player_id;
        },

        /**
         * Get player's profile
         * @returns {PlayerProfileModel}
         */
        getProfile : function () {
            return this.player_profile;
        },

        /**
         * Get player's inventory
         * @returns {BagModel}
         */
        getInventory : function () {
            return this.player_inventory;
        },

        /**
         * Get an item instance by bag and slot
         * @param bag_id
         * @param slot_id
         * @returns {object|null}
         */
        getItemInstance : function (bag_id, slot_id) {
            var bag = this.getBagByID(bag_id);
            if(bag !== null) {
                var slot = bag.getSlotByID(slot_id);
                if(slot !== null) {
                    return slot.item_instance;
                }
            }

            return null;
        },

        /**
         * Get an item instance UUID by bag and slot
         * @param bag_id
         * @param slot_id
         * @returns {String|null}
         */
        getItemInstanceUUID : function (bag_id, slot_id) {
            var item_instance = this.getItemInstance(bag_id, slot_id);
            return item_instance === null ? null : item_instance.item_instance_uuid;
        },

        /**
         * Get bag of the current player by id
         * @param bag_id
         * @returns {BagModel|null}
         */
        getBagByID : function (bag_id) {
            var board = this.boards.getPlayerBoards(this.getPlayerID());
            if(board) {
                return board.getBagByID(bag_id);
            }

            return null;
        },

        /**
         * Get slot by item instance uuid
         * @param bag_id
         * @param item_instance_uuid
         * @returns {Object|null}
         */
        getSlotByItemInstanceUUID : function( bag_id, item_instance_uuid ) {
           var bag = this.getBagByID( bag_id );
           return bag.getSlotByItemInstanceUUID( item_instance_uuid );
        },

        //--------------------------------------------------------------------------------------------
        // Setters
        //--------------------------------------------------------------------------------------------

        /**
         * Set front end API URL;
         * @param {String} url
         */
        setServerURL : function (url) {
            this.fe_api_url = url;
        },

        /**
         * Set Realm parameter for image uploader
         * @param {String} realm
         */
        setUploaderRealm : function (realm) {
            this.uploader_realm = realm;
        },

        /**
         * Set image uploader url;
         * @param {String} url
         */
        setUploaderURL : function (url) {
            this.uploader_url = url;
        },

        /**
         * If true, cookies are used to keep user auto login;
         * @param {Boolean} value
         */
        setUserKeepLoggedIn : function (value) {
            this.keepUserLoggedIn = value;
        },

        //--------------------------------------------------------------------------------------------
        // Other
        //--------------------------------------------------------------------------------------------

        /**
         * Check if the bag is inventory;
         * @param bag_id
         * @return {Boolean}
         */
        isInventory : function (bag_id) {
            return this.player_inventory.bag_id === bag_id;
        },

        /**
         * Destroy object values and set default values;
         * @param object
         */
        destroy : function (object) {
            var prop, type;
            for (prop in object) {
                if(object.hasOwnProperty(prop)) {
                    type = typeof (object[prop]);
                    if(type !== "function" && type !== "undefined") {
                        object[prop] = type === 'boolean' ? false : null;
                    }
                }
            }
        }
    };

    // check if cookies are used
    if (jQuery.cookie) {

        // Restore data from cookies;
        if(jQuery.cookie('snog_player_id')) {
            var pid = jQuery.cookie('snog_player_id');
            module.exports.player_id = parseInt(pid);
            module.exports.player_profile.player_id = module.exports.player_id;
        }

        if(jQuery.cookie('snog_auth_token')) {
            module.exports.auth_token = jQuery.cookie('snog_auth_token');
        }

        if(jQuery.cookie('snog_player_email')) {
            module.exports.player_email = jQuery.cookie('snog_player_email');
        }
    }
});/**
 *  Extends Snog.events by adding websocket events;
 */
Snog.events.WS_ON_DATA = "WEB_SOCKET_ON_DATA";                  // web socket on data event;
Snog.events.WS_STATUS_CHANGED = "WEB_SOCKET_STATUS_CHANGED";    // web socket status change event

/**
 * Web sockets module;
 *
 * If browser supports web sockets than this module is used to
 * receive async. messages pushed from the server.
 *
 * If browser doesn't support web sockets, the messages are added
 * ( piggybacked ) to the next sent request to the server.
 * As response we get an array of messages.
 *
 */
Snog.define("web_socket", function (require, exports, module) {
    "use strict";

    var snog_api = require('api');
    var snog_data = require('data');
    var snog_dispatcher = require('dispatcher');

    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.MozWebSocket || window.WebSocket;

    module.exports = {
        status: "disconnected",
        websocket: null,
        preventBroadcast: false,    // flag that prevents AUTO_LOGIN_SUCCESS event on reconnect;
        useCallback: true,          // if true, try to populate web socket messages via callbacks;
        debug: false,

        /**
         * Check if web socket is connected
         *
         * @returns {boolean}
         */
        isConnected: function () {
            return this.status === "connected"
        },

        /**
         * Check if web sockets are supported;
         * @return {Boolean}
         */
        isSupported: function () {
            return window.WebSocket !== null;
        },

        /**
         * Connect to the server
         * @param url
         */
        connect: function (url) {
            if (this.debug) {
                Snog.log('connect web sockets: ' + url);
            }

            if (!this.isSupported()) {
                if (this.debug) {
                    Snog.log('web sockets are not supported');
                }
                return;
            }

            var scope = this;
            this.websocket = new window.WebSocket(url);
            this.websocket.onopen = function (evt) {
                this.send('connect;format:json;player_id:' + snog_data.player_id + ';auth_token:' + snog_data.auth_token + ';');
            };
            this.websocket.onclose = function (evt) {
                scope.onClose(evt)
            };
            this.websocket.onmessage = function (evt) {
                scope.onMessage(evt)
            };
            this.websocket.onerror = function (evt) {
                scope.onError(evt)
            };
        },

        /**
         * Disconnect WebSockets;
         * If web sockets are disconnected, preventBroadcast is set to true,
         * next time when you reconnect to the server, AUTO_LOGIN_SUCCESS event will not be broadcasted;
         */
        disconnect: function () {
            if (this.websocket !== null && this.isConnected()) {
                this.status = "disconnected";
                this.preventBroadcast = true;   // if false, LOGIN_SUCCESS will be broadcasted on web socket reconnect;
                this.websocket.close();
            }
        },

        /**
         * Disconnects websockets if it's running and send AUTO_LOGIN event to connect ws
         */
        reconnect: function() {
            this.disconnect();
            this.preventBroadcast = true;
            snog_dispatcher.b(Snog.events.AUTO_LOGIN);
        },

        /**
         * Send a messages through WebSockets;
         * @param msg
         */
        send: function (msg) {
            if (this.websocket !== null && this.isConnected() ) {
                this.websocket.send(msg);
            }
        },

        /**
         * On message received
         *
         * @param evt
         */
        onMessage: function (evt) {
            if (this.debug) {
                Snog.log('web sockets message: ' + evt.data);
            }

            var receivedMsg = evt.data;
            if (receivedMsg === 'ok:connect') {
                this.status = "connected";
                snog_dispatcher.b(Snog.events.WS_STATUS_CHANGED, { status: this.status });
            } else {
                // broadcast event that some data received;
                // parse JSON.
                try {
                    var obj = JSON.parse(receivedMsg);
                    var sent = false;

                    // Try to execute callback function;
                    if (this.useCallback) {
                        var callback = require('callbacks')[obj.message_type + "_callback"];
                        if (callback) {
                            sent = true;
                            callback(obj, null);
                        }
                    }

                    // message still not sent, send pure WB event;
                    if (!sent) {
                        snog_dispatcher.b(Snog.events.WS_ON_DATA, obj);
                    }

                } catch (e) {

                    // can't parse object with JSON, send as it is;
                    snog_dispatcher.b(Snog.events.WS_ON_DATA, receivedMsg);
                }
            }
        },

        /**
         * On WebSockets closed
         *
         * @param evt
         */
        onClose: function (evt) {
            if (this.debug) {
                Snog.log('web sockets close');
            }

            // if server stops WS, the status will remain 'connected';
            // status 'disconnected' means that user is logged out;
            if (this.status === "disconnected") {
                snog_dispatcher.b(Snog.events.WS_STATUS_CHANGED, { status: this.status });
            } else {
                // reconnect to the server by sending AUTO_LOGIN event;
                if (snog_data.auth_token !== null) {
                    this.preventBroadcast = true;
                    snog_dispatcher.b(Snog.events.AUTO_LOGIN);
                }
            }
        },

        onError: function (evt) {
            console.log("web socket error: " + evt);
        }
    };

    exports = module.exports;

    //--------------------------------------------------------------------------------------------
    //
    // Extend / Override callbacks;
    //
    //--------------------------------------------------------------------------------------------

    // Extend callbacks;
    var snog_callbacks = require("callbacks");

    /**
     * Connect to websockets;
     * @param response
     * @param request
     */
    snog_callbacks.websocket_environment_callback = function (response, request) {
        exports.uri = 'wss://' + response.host + ':' + response.port;
        exports.connect(exports.uri);

        // store web_socket url in cookies
        if (jQuery.cookie) {
            jQuery.cookie("snog_ws", exports.uri, { path: '/' });
        }
    };

    /**
     * Auto login success callback;
     * @param response
     * @param request
     */
    snog_callbacks.login_success_auto_callback = function (response, request) {
        snog_callbacks.on_login_success(response);

        // !!!! Server drops WS connection after 20 idle minutes;
        // !!!! In order to reconnect AUTO_LOGIN event is send;
        // !!!! So, don't broadcast AUTO_LOGIN_SUCCESS on WS reconnection;
        if (!exports.preventBroadcast) {
            snog_dispatcher.b(Snog.events.AUTO_LOGIN_SUCCESS, response);
        }
    };

    /**
     * Auto login error callback;
     * @param response
     * @param request
     */
    snog_callbacks.login_error_auto_callback = function (response, request) {
        snog_api._authorizing = false;

        // !!!! Server drops WS connection after 20 idle minutes;
        // !!!! In order to reconnect AUTO_LOGIN event is send;
        // !!!! So, don't broadcast AUTO_LOGIN_SUCCESS on WS reconnection;
        if (!exports.preventBroadcast) {
            snog_dispatcher.b(Snog.events.AUTO_LOGIN_ERROR, response);
        }
    };
});
/**
 * Callbacks module provides functions called from 'api' module
 * on success or error server responses. On callback function call
 * a corresponding event is broadcasted;
 *
 * In addition the module updates 'data' module;
 *
 */
Snog.define('callbacks', function (require, exports, module) {
    "use strict";

    var snog_dispatcher = require('dispatcher');
    var snog_api = require('api');
    var snog_data = require('data');

    module.exports = {

        //--------------------------------------------------------------------------------------------
        // General callbacks
        //--------------------------------------------------------------------------------------------

        /**
         * Pong callback on ping request;
         * @param response
         * @param request
         */
        pong_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.PONG, response);
        },

        //--------------------------------------------------------------------------------------------
        // Login callbacks
        //--------------------------------------------------------------------------------------------

        /**
         * Login success callback;
         * @param response
         * @param request
         */
        on_login_success: function (response, request) {
            // token and player id into cookies;
            snog_data.player_id = parseInt(response.player_id, 10);
            snog_data.auth_token = response.auth_token;

            if (jQuery.cookie && snog_data.keepUserLoggedIn) {
                jQuery.cookie('snog_player_id', snog_data.player_id, { path: '/' });
                jQuery.cookie('snog_auth_token', snog_data.auth_token, { path: '/' });
            }

            if (snog_data !== null) {
                snog_data.player_profile.player_id = snog_data.player_id;
            }

            snog_api._authorizing = false;
        },

        /**
         * Login success
         * @param response
         * @param request
         */
        login_success_callback: function (response, request) {
            this.on_login_success(response);

            // broadcast event about success login;
            snog_dispatcher.b(Snog.events.LOGIN_SUCCESS, response);
        },

        /**
         * Login error callback;
         * @param response
         * @param request
         */
        login_error_callback: function (response, request) {
            snog_api._authorizing = false;
            snog_dispatcher.b(Snog.events.LOGIN_ERROR, response);
        },

        /**
         * Auto login success callback;
         *
         * Important!
         * This function is overriden in snog_websocket module;
         *
         * @param response
         * @param request
         */
        login_success_auto_callback: function (response, request) {
            this.on_login_success(response);
            snog_dispatcher.b(Snog.events.AUTO_LOGIN_SUCCESS, response);
        },

        /**
         * Auto login error callback;
         *
         * Important!
         * This function is overriden in snog_websocket module;
         *
         * @param response
         * @param request
         */
        login_error_auto_callback: function (response, request) {
            snog_api._authorizing = false;
            snog_dispatcher.b(Snog.events.AUTO_LOGIN_ERROR, response);
        },

        /**
         * Logout success callback;
         * @param response
         * @param request
         */
        logout_success_callback: function (response, request) {
            snog_data.player_id = null;
            snog_data.auth_token = null;
            snog_data.player_email = null;

            // clear cookies data;
            if ( jQuery.cookie ) {
                try {
                    jQuery.cookie('snog_player_email', null, { path: '/' });
                    jQuery.cookie('snog_player_id', null, { path: '/' });
                    jQuery.cookie('snog_auth_token', null, { path: '/' });
                    jQuery.cookie('snog_ws', null, { path: '/' });
                    jQuery.cookie('snog_facebook_action', null, { path: '/' });
                } catch (e) {
                }
            }

            // destroy all data;
            snog_data.onDestroy();

            // broadcast event about success login;
            snog_dispatcher.b(Snog.events.LOGOUT_SUCCESS, response);
        },

        /**
         * Signup error callback;
         * @param response
         * @param request
         */
        signup_and_login_error_callback: function (response, request) {
            snog_api._authorizing = false;
            snog_dispatcher.b(Snog.events.SIGN_UP_ERROR, response);
        },

        /**
         * Captcha callback;
         * @param response
         * @param request
         */
        auth_challenge_callback: function (response, request) {
            // store auth type;
            snog_data.auth_type = response.type;

            // try load necessary module;
            var auth_module = Snog.require(response.type);
            if ( auth_module ) {

                // set challenge id and public key;
                auth_module.auth_challenge_id = response.auth_challenge_id;
                auth_module.auth_challenge_pk = response.public_key;

                // broadcast;
                snog_dispatcher.b(Snog.events.NEW_AUTH_CHALLENGE_SUCCESS, response);
                return;
            }

            // throw an error if we try to activate module that doesn't exist
            var error = new Error( response.type + " module is missing " );
            error.name = "SnogCallbackError";
            throw new Error(error)
        },

        /**
         * Captcha error callback;
         * @param response
         * @param request
         */
        auth_challenge_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.NEW_AUTH_CHALLENGE_ERROR, response);
        },

        //--------------------------------------------------------------------------------------------
        // Password callbacks
        //--------------------------------------------------------------------------------------------

        /**
         * Password changed callback
         * @param response
         * @param request
         */
        password_changed_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.CHANGE_PASSWORD_SUCCESS, response);
        },

        /**
         * Password change error callback
         * @param response
         * @param request
         */
        bad_password_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.CHANGE_PASSWORD_ERROR, response);
        },

        /**
         * Password forgotten error callback
         * @param response
         * @param request
         */
        password_forgotten_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.RESET_PASSWORD_ERROR, response);
        },

        /**
         * Temporary password callback;
         * @param response
         * @param request
         */
        temporary_password_sent_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.RESET_PASSWORD_SUCCESS, response);
        },

        //--------------------------------------------------------------------------------------------
        // Item and Bag
        //--------------------------------------------------------------------------------------------
        /**
         * Inventory load callback or board instance bag load callback;
         * @param response
         * @param request
         */
        bag_callback: function (response, request) {
            switch (request.message_type) {
                case "get_player_inventory":
                    // update inventory model;
                    // INVENTORY_CHANGED event is dispatched;
                    if (snog_data !== null) {
                        snog_data.player_inventory.setBag(response, snog_data.player_id);
                    }

                    snog_dispatcher.b(Snog.events.GET_PLAYER_INVENTORY_SUCCESS);
                    break;
                case "read_board_instance_and_bag":

                    if (snog_data !== null) {
                        // update another player's board bag;
                        var model = snog_data.boards.getPlayerBoards(request.player_id);
                        model.setBag(response, request.player_id);
                    }

                    snog_dispatcher.b(Snog.events.LOAD_BOARD_INSTANCE_BAG_SUCCESS, response);
                    break;
                default:
                    Snog.log("Unhandled bag_callback: " + request.message_type);
                    break;
            }
        },

        /**
         * Inventory load error callback;
         * @param response
         * @param request
         */
        get_player_inventory_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.GET_PLAYER_INVENTORY_ERROR, response);
        },

        /**
         * Item instance read callback;
         * @param response
         * @param request
         */
        item_instance_callback: function (response, request) {
            if (snog_data !== null) {
                snog_data.items.addItemInstance(response);
            }

            snog_dispatcher.b(Snog.events.READ_ITEM_INSTANCE_SUCCESS, response);
        },

        /**
         * Item instance read error callback;
         * @param response
         * @param request
         */
        read_item_instance_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.READ_ITEM_INSTANCE_ERROR, response);
        },

        /**
         * Read board instance and bag error;
         * @param response
         * @param request
         */
        read_board_instance_and_bag_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.LOAD_BOARD_INSTANCE_BAG_ERROR, response);
        },

        /**
         * Item metadata read callback
         *
         * @param response
         * @param request
         */
        item_callback: function (response, request) {
            if (snog_data !== null) {
                snog_data.items.updateItem(response);
            }

            snog_dispatcher.b(Snog.events.READ_ITEM_SUCCESS, response);
        },

        /**
         * Item metadata read error callback
         * @param response
         * @param request
         */
        read_item_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.READ_ITEM_ERROR, response);
        },

        /**
         *  Take item from the batch or IGM callback;
         * @param response
         * @param request
         */
        item_instance_taken_callback: function (response, request) {
            if (request.message_type === 'take_item_instance_from_batch') {
                if (snog_data !== null) {
                    // add an item from the batch to the inventory model;
                    // when the item is deleted BATCH_CHANGED event broadcasts;
                    var batch = snog_data.batches.getBatchByUUID(request.batch_uuid);
                    var item_instance = batch.releaseItemByUUID(request.item_instance_uuid);

                    // when the item is added to the inventory,
                    // INVENTORY_CHANGED event is dispatched;
                    snog_data.player_inventory.addItemInstance(item_instance);
                }

                snog_dispatcher.b(Snog.events.TAKE_ITEM_FROM_BATCH_SUCCESS, response);
            } else {
                // request inventory from the server;
                snog_dispatcher.b(Snog.events.GET_PLAYER_INVENTORY);

                // item was taken from IGM
                snog_dispatcher.b(Snog.events.TAKE_ITEM_FROM_IGM_SUCCESS, response);
            }
        },

        /**
         * Take item from the batch error callback;
         * @param response
         * @param request
         */
        take_item_instance_from_batch_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.TAKE_ITEM_FROM_BATCH_ERROR, response);
        },

        /**
         * Take item from IGM error callback;
         * @param response
         * @param request
         */
        take_item_instance_from_igm_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.TAKE_ITEM_FROM_IGM_ERROR, response);
        },

        /**
         * Item delete callback;
         * @param response
         * @param request
         */
        item_instance_dropped_callback: function (response, request) {
            // update inventory model;
            // INVENTORY_CHANGED event is dispatched;
            if (response.bag_id === snog_data.player_inventory.bag_id) {
                if (snog_data !== null) {
                    snog_data.player_inventory.removeItemInstanceAtSlot(response.slot_id);
                }

                snog_dispatcher.b(Snog.events.DROP_INVENTORY_ITEM_SUCCESS, response);
            } else {
                if (snog_data !== null) {
                    var boards = snog_data.boards.getPlayerBoards(snog_data.player_id);
                    var bag = boards.getBagByID(response.bag_id);
                    bag.removeItemInstanceAtSlot(response.slot_id);
                }

                snog_dispatcher.b(Snog.events.DROP_ITEM_SUCCESS, response);
            }
        },

        /**
         * Item delete error callback;
         * @param response
         * @param request
         */
        drop_item_instance_error_callback: function (response, request) {
            if (request.bag_id === snog_data.player_inventory.bag_id) {
                snog_dispatcher.b(Snog.events.DROP_INVENTORY_ITEM_ERROR, response);
            } else {
                snog_dispatcher.b(Snog.events.DROP_ITEM_ERROR, response);
            }
        },

        /**
         * Item instances swapped callback;
         * @param response
         * @param request
         */
        item_instances_swapped_callback: function (response, request) {
            // check for the same bag;
            if (snog_data !== null) {
                var boards = snog_data.boards.getPlayerBoards(snog_data.player_id);
                if (response.from_bag_id === response.to_bag_id) {
                    var bag = boards.getBagByID(response.to_bag_id);
                    bag.swapItemsBySlots(response.from_slot_id, response.to_slot_id);
                } else {
                    // item was taken or swapped from one bag to another;
                    var from_bag = boards.getBagByID(response.from_bag_id);
                    var to_bag = boards.getBagByID(response.to_bag_id);
                    var item_instance = from_bag.getItemInstanceByUUID(response.from_item_instance_uuid).item_instance;

                    // remove items and add;
                    from_bag.removeItemInstanceAtSlot(response.from_slot_id);
                    to_bag.addItemInstance(item_instance, response.to_slot_id);
                }
            }

            snog_dispatcher.b(Snog.events.SWAP_ITEM_INSTANCES_SUCCESS, response);
        },

        /**
         * Item instances swapped error callback;
         * @param response
         * @param request
         */
        swap_item_instances_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.SWAP_ITEM_INSTANCES_ERROR, response);
        },

        /**
         * Item instance gifted callback;
         * @param response
         * @param request
         */
        item_instance_gifted_callback: function (response, request) {
            if (snog_data !== null) {
                // remove item from the inventory
                if (snog_data.player_inventory.bag_id === response.bag_id) {
                    snog_data.player_inventory.removeItemInstanceAtSlot(response.slot_id);
                } else {
                    var boards = snog_data.boards.getPlayerBoards(snog_data.player_id);
                    var bag = boards.getBagByID(response.bag_id);
                    if (bag !== null) {
                        bag.removeItemInstanceAtSlot(response.slot_id);
                    }
                }
            }

            snog_dispatcher.b(Snog.events.GIFT_ITEM_SUCCESS, response);
        },

        /**
         * Item instance gift error callback;
         * @param response
         * @param request
         */
        gift_item_instance_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.GIFT_ITEM_ERROR, response);
        },

        /**
         * Item batch callback
         * @param response
         * @param request
         */
        item_instance_batch_callback: function (response, request) {
            if (snog_data !== null) {
                // add a new batch to the batches model;
                // BATCH_CHANGED event is dispatched;
                snog_data.batches.addBatch(response);
            }

            // broadcast an event;
            var batch = snog_data.batches.getBatchByUUID(response.batch_uuid);
            snog_dispatcher.b(Snog.events.GET_ITEM_BATCH_SUCCESS, batch);
        },

        /**
         * Item batch error callback
         * @param response
         * @param request
         */
        get_item_batch_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.GET_ITEM_BATCH_ERROR, response);
        },

        //--------------------------------------------------------------------------------------------
        // Boards
        //--------------------------------------------------------------------------------------------

        /**
         * Boards list callback;
         * @param response
         * @param request
         */
        board_list_callback: function (response, request) {
            // load board instances for the current player;
            snog_dispatcher.b(Snog.events.GET_BOARDS_INSTANCES, {type: request.board_type });

            if (snog_data !== null) {
                // set boards
                // BOARDS_CHANGED event is dispatched;
                var boards = snog_data.boards.getPlayerBoards(snog_data.player_id);
                boards.setBoardList(response);
            }

            snog_dispatcher.b(Snog.events.GET_BOARDS_LIST_SUCCESS, response.boards);
        },

        /**
         * Board list error callback
         * @param response
         * @param request
         */
        board_list_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.GET_BOARDS_LIST_ERROR, response);
        },

        /**
         * Board instances list callback;
         * @param response
         * @param request
         */
        board_instance_slot_list_callback: function (response, request) {
            if (snog_data !== null) {
                var boards = snog_data.boards.getPlayerBoards(request.player_id);
                boards.setBoardInstanceSlotList(response);
            }

            snog_dispatcher.b(Snog.events.GET_BOARDS_INSTANCES_SUCCESS, response.slots);
        },

        /**
         * Board instances list error callback;
         * @param response
         * @param request
         */
        board_instance_slot_list_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.GET_BOARDS_INSTANCES_ERROR, response);
        },

        /**
         * Board instance callback;
         * @param response
         * @param request
         */
        board_instance_callback: function (response, request) {
            var boards = null;
            if (request.message_type === 'create_board_instance') {
                if (snog_data !== null) {
                    // update model;
                    boards = snog_data.boards.getPlayerBoards(snog_data.player_id);
                    boards.createBoardInstance(response);
                }

                snog_dispatcher.b(Snog.events.CREATE_BOARD_INSTANCE_SUCCESS, response);
            } else {
                if (request.message_type === 'read_board_instance_bag') {
                    if (snog_data !== null) {
                        boards = snog_data.boards.getPlayerBoards(request.player_id);
                        boards.updateBoardInstance(response);
                    }

                    snog_dispatcher.b(Snog.events.READ_ITEM_INSTANCE_SUCCESS, response);
                }
            }
        },

        /**
         * Create board instance error callback
         * @param response
         * @param request
         */
        create_board_instance_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.CREATE_BOARD_INSTANCE_ERROR, response);
        },

        /**
         * Read board instance bag error callback;
         * @param response
         * @param request
         */
        read_board_instance_bag_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.READ_ITEM_INSTANCE_ERROR, response);
        },

        /**
         * Update board comment callback
         * @param response
         * @param request
         */
        board_instance_comment_updated_callback: function (response, request) {
            if (snog_data !== null) {
                var boards = snog_data.boards.getPlayerBoards(snog_data.player_id);
                boards.updateBoardInstanceComment(request.board_instance_id, request.comment);
            }

            snog_dispatcher.b(Snog.events.UPDATE_BOARD_INSTANCE_COMMENT_SUCCESS, response);
        },

        /**
         * Update board comment error callback
         * @param response
         * @param request
         */
        update_board_instance_comment_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.UPDATE_BOARD_INSTANCE_COMMENT_ERROR, response);
        },

        /**
         * Board instance locked callback;
         * @param response
         * @param request
         */
        board_instance_locked_callback: function (response, request) {
            if (snog_data !== null) {
                var boards = snog_data.boards.getPlayerBoards(snog_data.player_id);
                boards.lockBoardInstanceSlotByID(response.board_instance_id);
            }

            snog_dispatcher.b(Snog.events.LOCK_BOARD_INSTANCE_SUCCESS, response);
        },

        /**
         * Board instance locked error callback;
         * @param response
         * @param request
         */
        lock_board_instance_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.LOCK_BOARD_INSTANCE_ERROR, response);
        },

        /**
         * Board instance unlocked callback;
         * @param response
         * @param request
         */
        board_instance_unlocked_callback: function (response, request) {
            if (snog_data !== null) {
                var boards = snog_data.boards.getPlayerBoards(snog_data.player_id);
                boards.unlockBoardInstanceSlotByID(response.board_instance_id);
            }

            snog_dispatcher.b(Snog.events.UNLOCK_BOARD_INSTANCE_SUCCESS, response);
        },

        /**
         * Board instance unlocked error callback;
         * @param response
         * @param request
         */
        unlock_board_instance_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.UNLOCK_BOARD_INSTANCE_ERROR, response);
        },

        /**
         * Board instance delete callback;
         * @param response
         * @param request
         */
        board_instance_deleted_callback: function (response, request) {
            if (snog_data !== null) {
                var boards = snog_data.boards.getPlayerBoards(snog_data.player_id);
                boards.deleteBoardInstanceSlotByID(response.board_instance_id);
            }

            snog_dispatcher.b(Snog.events.DELETE_BOARD_INSTANCE_SUCCESS, response);
        },

        /**
         * Delete board instance error callback
         * @param response
         * @param request
         */
        delete_board_instance_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.DELETE_BOARD_INSTANCE_ERROR, response);
        },

        //--------------------------------------------------------------------------------------------
        // Player status
        //--------------------------------------------------------------------------------------------

        /**
         * Player status callback
         * @param response
         * @param request
         */
        player_status_callback: function (response, request) {
            if (snog_data !== null) {
                snog_data.player_status.setStatus(response);
            }

            snog_dispatcher.b(Snog.events.PLAYER_STATUS, response);
        },

        //--------------------------------------------------------------------------------------------
        // Compatibility_results
        //--------------------------------------------------------------------------------------------

        /**
         * Compatibility results;
         * @param response
         * @param request
         */
        compatibility_results_callback: function (response, request) {
            if (snog_data !== null) {
                snog_data.player_compatibility.setResults(response);
            }

            snog_dispatcher.b(Snog.events.CALCULATE_COMPATIBILITY_SUCCESS, response);
        },

        //--------------------------------------------------------------------------------------------
        // Rewards
        //--------------------------------------------------------------------------------------------

        /**
         * Rewards list callback
         * @param response
         * @param request
         */
        rewards_list_callback: function (response, request) {
            if (snog_data !== null) {
                // Update rewards model,
                // REWARDS_CHANGED event is sent;
                snog_data.player_rewards.setRewards(response);
            }

            snog_dispatcher.b(Snog.events.GET_REWARDS_SUCCESS, response);
        },

        /**
         * Rewards list error callback
         * @param response
         * @param request
         */
        rewards_list_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.GET_REWARDS_ERROR, response);
        },

        /**
         * Ruewards instances callback;
         * @param response
         * @param request
         */
        reward_instances_list_callback: function (response, request) {
            if (snog_data !== null) {
                // Update rewards model,
                // REWARD_INSTANCES_CHANGED event is sent;
                snog_data.player_rewards.setRewardInstances(response);
            }

            snog_dispatcher.b(Snog.events.GET_REWARD_INSTANCES_SUCCESS, response);
        },

        //--------------------------------------------------------------------------------------------
        // Profile
        //--------------------------------------------------------------------------------------------

        /**
         * Profile callback;
         * @param response
         * @param request
         */
        profile_callback: function (response, request) {
            // update profile data model;
            // on update PROFILE_CHANGED event is dispatched;
            if (response.player_id === snog_data.player_id) {
                if (snog_data !== null) {
                    snog_data.player_profile.setProfile(response);

                    // update player's email as it may not be set;
                    if (snog_data.player_email === null) {
                        snog_data.player_email = snog_data.player_profile.email;

                        // store player's email in cookies;
                        if (jQuery.cookie && snog_data.keepUserLoggedIn) {
                            jQuery.cookie('snog_player_email', snog_data.player_email, { path: '/' });
                        }
                    }
                }

                if (request.message_type === 'update_profile') {
                    snog_dispatcher.b(Snog.events.UPDATE_PLAYER_PROFILE_SUCCESS, response);
                } else {
                    snog_dispatcher.b(Snog.events.READ_PLAYER_PROFILE_SUCCESS, response);
                }
            } else {
                if (snog_data !== null) {
                    var player = snog_data.profiles.getPlayerProfileByID(response.player_id);
                    player.setProfile(response);
                    snog_data.profiles.setPlayerModel(player);
                }

                snog_dispatcher.b(Snog.events.READ_PLAYER_PROFILE_SUCCESS, response);
            }
        },

        /**
         * Profile error callback;
         * @param response
         * @param request
         */
        profile_error_callback: function (response, request) {
            if (request.message_type === 'update_profile') {
                snog_dispatcher.b(Snog.events.UPDATE_PLAYER_PROFILE_ERROR, response);
            } else {
                snog_dispatcher.b(Snog.events.READ_PLAYER_PROFILE_ERROR, response);
            }
        },

        /**
         * Avatar updated callback;
         * @param response
         * @param request
         */
        avatar_updated_callback: function (response, request) {
            if (snog_data !== null) {
                snog_data.player_profile.updateAvatar(snog_data.temp_avatar_uri);
            }

            snog_data.temp_avatar_uri = null;
            snog_dispatcher.b(Snog.events.UPDATE_PLAYER_AVATAR_SUCCESS, response);
        },

        /**
         * Avatar updated error callback;
         * @param response
         * @param request
         */
        update_profile_avatar_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.UPDATE_PLAYER_AVATAR_ERROR, response);
        },

        //--------------------------------------------------------------------------------------------
        // Messages
        //--------------------------------------------------------------------------------------------

        /**
         * Inbox IGM callback;
         * @param response
         * @param request
         */
        igm_inbox_callback: function (response, request) {
            if (snog_data !== null) {
                // update model;
                // INBOX_CHANGED event is dispatched;
                snog_data.player_messages.setInbox(response);

                // set pages
                snog_data.player_messages.inboxMessages.page_size = request.hasOwnProperty('page_size') ? request.page_size : null;
                snog_data.player_messages.inboxMessages.page_index = request.hasOwnProperty('page_index') ? request.page_index : null;
            }

            if (request.hasOwnProperty('page_size')) {
                snog_dispatcher.b(Snog.events.LOAD_PAGED_INBOX_MESSAGES_SUCCESS, response.igms);
            } else {
                snog_dispatcher.b(Snog.events.LOAD_INBOX_MESSAGES_SUCCESS, response.igms);
            }
        },

        /**
         * Inbox IGM callback;
         * @param response
         * @param request
         */
        igm_outbox_callback: function (response, request) {
            if (snog_data !== null) {
                // update model;
                // OUTBOX_CHANGED event is dispatched;
                snog_data.player_messages.setOutbox(response);
            }

            // set pages
            snog_data.player_messages.outboxMessages.page_size = request.hasOwnProperty('page_size') ? request.page_size : null;
            snog_data.player_messages.outboxMessages.page_index = request.hasOwnProperty('page_index') ? request.page_index : null;

            if (request.hasOwnProperty('page_size')) {
                snog_dispatcher.b(Snog.events.LOAD_PAGED_OUTBOX_MESSAGES_SUCCESS, response.igms);
            } else {
                snog_dispatcher.b(Snog.events.LOAD_OUTBOX_MESSAGES_SUCCESS, response.igms);
            }
        },


        /**
         * Read IGM callback;
         * @param response
         * @param request
         */
        igm_callback: function (response, request) {
            if (snog_data !== null) {
                // update inbox model;
                // MESSAGE_CHANGED event is fired;
                snog_data.player_messages.updateMessage(response);
            }

            snog_dispatcher.b(Snog.events.READ_MESSAGE_SUCCESS,
                                      snog_data.player_messages.getMessageByID(response.igm_id));
        },

        /**
         * Read IGM error callback
         * @param response
         * @param request
         */
        read_igm_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.READ_MESSAGE_ERROR, response);
        },

        /**
         * Error on new_igm
         * @param response
         * @param request
         */
        new_igm_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.NEW_IGM_ERROR, response);
        },

        /**
         * New IGM error callback
         * @param response
         * @param request
         */
        igm_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.READ_MESSAGE_ERROR, response);
        },

        //--------------------------------------------------------------------------------------------
        // Friends
        //--------------------------------------------------------------------------------------------

        /**
         * Friends list callback
         * @param response
         * @param request
         */
        friends_list_callback: function (response, request) {
            if (snog_data !== null) {
                // update model;
                if (response.player_id === snog_data.player_id) {
                    snog_data.player_friends.setFriends(response);
                }
            }

            snog_dispatcher.b(Snog.events.LOAD_FRIENDS_SUCCESS, response);
        },

        /**
         * Friends list error callback
         * @param response
         * @param request
         */
        friends_list_error_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.LOAD_FRIENDS_ERROR, response);
        },

        /**
         * Friend request sent callback
         * @param response
         * @param request
         */
        friend_request_sent_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.PROPOSE_FRIENDSHIP_SUCCESS, response);
        },

        //--------------------------------------------------------------------------------------------
        // Leaderboards
        //--------------------------------------------------------------------------------------------

        /**
         * Leaderboard success callback;
         * @param response
         * @param request
         */
        leaderboard_callback: function (response, request) {
            if (snog_data !== null) {
                snog_data.leaders.setLeaders(request.type, request.filter, request.board_ref, response);
            }

            snog_dispatcher.b(Snog.events.GET_LEADERBOARD_SUCCESS, response);
        },

        /**
         * Leaderboard error callback;
         * @param response
         * @param request
         */
        leaderboard_not_found_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.GET_LEADERBOARD_ERROR, response);
        },

        //--------------------------------------------------------------------------------------------
        // Milestones
        //--------------------------------------------------------------------------------------------

        /**
         * Milestones list success callback
         * @param response
         * @param request
         */
        milestone_list_callback: function (response, request) {
            if (snog_data !== null) {
                snog_data.player_milestones.setMilestonesList(response);
            }

            snog_dispatcher.b(Snog.events.GET_MILESTONES_SUCCESS, response.milestones);
        },

        /**
         * Milestone item read success callback
         * @param response
         * @param request
         */
        milestone_callback: function (response, request) {
            if (snog_data !== null) {
                snog_data.player_milestones.setMilestone(response);
            }

            snog_dispatcher.b(Snog.events.READ_MILESTONE_SUCCESS, response);
        },

        /**
         * Milestone item not found callback
         * @param response
         * @param request
         */
        milestone_not_found_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.READ_MILESTONE_ERROR, response);
        },

        //--------------------------------------------------------------------------------------------
        // Preferences
        //--------------------------------------------------------------------------------------------

        preference_callback: function(response,request) {
            snog_dispatcher.b(Snog.events.GET_PREFERENCE_SUCCESS, response);

            if ( snog_data !== null ) {
                snog_data.preferences.set(response);
            }
        },

        get_preference_error_callback: function( response, request) {
            snog_dispatcher.b(Snog.events.GET_PREFERENCE_ERROR, response);
        },

        preference_stored_callback: function( response, request ) {
            snog_dispatcher.b(Snog.events.SET_PREFERENCE_SUCCESS, response);
        },

        //--------------------------------------------------------------------------------------------
        // Async
        //--------------------------------------------------------------------------------------------

        /**
         * Async. acknoledgement callback;
         * @param response
         * @param request
         */
        acknowledgement_callback: function (response, request) {
            switch (response.ack_type) {

                case "wilco":
                    switch (response.ack_context) {
                        case "delete_igm":
                            if (snog_data !== null) {
                                // update inbox model;
                                // MESSAGE_DELETED event is dispatched;
                                snog_data.player_messages.inboxMessages.deleteMessageByID(request.igm_id);
                            }

                            snog_dispatcher.b(Snog.events.DELETE_MESSAGE_ACKNOWLEDGEMENT, request);
                            break;
                        case "reply_igm":
                            if (snog_data !== null) {
                                // manually add message into reply array;
                                snog_data.player_messages.inboxMessages.updateReply(request.igm_id, request);
                            }

                            snog_dispatcher.b(Snog.events.REPLY_MESSAGE_ACKNOWLEDGEMENT, {request: request });
                            break;
                        case "new_igm":
                            snog_dispatcher.b(Snog.events.NEW_MESSAGE_ACKNOWLEDGEMENT, {request: request });
                            break;

                        case "find_players":
                            snog_dispatcher.b(Snog.events.FIND_PLAYERS_ACKNOWLEDGEMENT, {request: request });
                            break;

                        default:
                            Snog.log("Unhandled wilco ask_context: " + response.ack_context);
                            break;
                    }
                    break;

                case "compatibility_calculation_request":
                    snog_dispatcher.b(Snog.events.COMPATIBILITY_ACKNOWLEDGEMENT, {request: request });
                    break;

                case "redeem_code":
                    snog_dispatcher.b(Snog.events.REDEEM_CODE_ACKNOWLEDGEMENT, {request: request });

                default:
                    Snog.log("Unhandled acknowledgement_callback: " + request.message_type);
                    break;
            }
        },

        /**
         * Players found callback;
         * @param response
         * @param request
         */
        players_found_callback: function (response, request) {
            if (response.profiles && response.profiles.length > 0) {
                snog_data.profiles.setProfiles(response.profiles);
            }

            snog_dispatcher.b(Snog.events.FIND_PLAYERS_SUCCESS, response);
        },

        /**
         * Notifications callback
         * @param response
         * @param request
         */
        notification_callback: function (response, request) {
            if (response.kind === "igm") {
                snog_dispatcher.b(Snog.events.NOTIFICATION_NEW_MESSAGE, response);
            } else {
                if (response.kind === "reward") {
                    snog_dispatcher.b(Snog.events.NOTIFICATION_REWARD, response);
                }
            }

            // general type notification
            snog_dispatcher.b(Snog.events.NOTIFICATION, response);
        },

        /**
         * Response on PLAYER_STATUS
         * @param response
         * @param request
         */
        status_message_callback: function( response, request ) {
            // general type notification
            snog_dispatcher.b(Snog.events.STATUS_MESSAGE, response);
        },

        //--------------------------------------------------------------------------------------------
        // General Errors
        //--------------------------------------------------------------------------------------------

        /**
         * General server error callback
         * @param response
         * @param request
         */
        server_error_callback: function (response, request) {
            snog_api._authorizing = false;
            snog_dispatcher.b(Snog.events.SERVER_ERROR, { response: response, request: request });
        },

        /**
         * Unauthorized callback;
         * @param response
         * @param request
         */
        unauthorized_callback: function (response, request) {
            snog_dispatcher.b(Snog.events.UNAUTHORIZED, { response: response, request: request });
        }
    };
});
/**
 * API module provides client - server communication using AJAX;
 *
 * 'callbacks' module is responsible for calling the responses;
 */
Snog.define("api", function (require, exports, module) {

    // force to check security;
    if (jQuery)
        jQuery.support.cors = true;


    // Flag that indicates if authorization in process
    exports._authorizing = false;

    /**
     * Check internet connection here;
     * Override this function to add custom functionality to check
     * internet connection if needed;
     *
     * @return {Boolean}
     */
    exports.isConnected = function () {
        return true;
    };

    /**
     * Return value if authorization in process;
     * @returns {Boolean}
     */
    exports.isAuthorizing = function () {
        return exports._authorizing;
    };

    /**
     * Execute callback function by name;
     *
     * @param callback_name
     * @param response
     * @param request
     * @param args (optional)
     */
    exports.applyCallback = function (callback_name, response, request, args) {
        var snog_callbacks = Snog.require('callbacks');

        if (snog_callbacks.hasOwnProperty(callback_name)) {
            snog_callbacks[callback_name](request, response);
        } else {
            Snog.error("Missing callback: " + callback_name);
        }
    };

    /**
     * Wrapper around jQuery AJAX request;
     *
     * @param request (Object) - original request to the server;
     * @param response_message_type (String) - response message type that is used to find the callback;
     * @param error_types (Array) - an array of error response message types;
     * @param prefixes (Array) - an array of custom prefixes to be added to execute callback. Default - ['_callback', '_error_callback']
     *
     * For example:
     * exports.applyAJAX(request, 'pong', null, null);
     *
     * on success - will try to execute ``pong_callback`` function;
     * on error -   will try to execute an error callback function based on error_type + '_error_callback' prefix;
     *              if we define "error_types" array than these callbacks are checked first;
     *
     * For example:
     * exports.applyAJAX(request, 'pong', ['server_error'], ['_custom_name']);
     *
     * on success - will try to execute ``pong_custom_name`` function;
     * on error -   will try to execute ``server_error_custom_name`` function;
     *              or server_error_callback;
     *
     * For example:
     * exports.applyAJAX(request, 'pong', ['server_error'], ['_success', '_error']);
     *
     * on success - will try to execute ``pong_success`` function;
     * on error -   will try to execute ``pong_error`` function;
     *              If there is no ``callbacks.pong_error`` function an error will occur;
     *
     */
    exports.applyAJAX = function (request, response_message_type, error_types, prefixes) {
        if (!exports.isConnected()) {
            return;
        }

        var headers = {};
        var snog_data = Snog.require('data');

        if (snog_data.auth_token !== null) {
            headers['X-SNO-GE-Player-Auth-Token'] = snog_data.auth_token;
        }

        Snog.log(request);

        var args = arguments;
        var ajax = jQuery.ajax({
                              url: snog_data.fe_api_url,
                              type: 'POST',
                              dataType: 'json',
                              contentType: 'application/json; charset=utf-8',
                              data: JSON.stringify(request),
                              headers: headers
                          });

        ajax.done(function (responses_array) {
            exports.onAJAXSuccess(responses_array, args);
        });

        ajax.fail(function (jqXHR, textStatus, errorThrown) {
            exports.onAJAXError(jqXHR, textStatus, errorThrown);
        });
    };

    /**
     * AJAX Success handler;
     *
     * @param {Array} responses_array
     * @param {Array} request_args
     *      [0] - {Object} original request made to the server
     *      [1] - {String} expected SUCCESS message type
     *      [2] - {Array|String} expected ERROR message type(s)
     *      [3] - {Array} Prefix name that is used instead of default '_callback'
     *              !!! Max 2 callbacks, first for the success, second for the error;
     *              !!! SUCCESS message type is always mapped to the prefixes[0]
     *              !!! payload message type(s) are not mapped to the prefixes and executed with '_callback' prefix
     */
    exports.onAJAXSuccess = function (responses_array, request_args) {
        var i, response, callback_name;
        var request = request_args[0];
        var response_message_types = request_args[1];
        var error_types = request_args[2];
        var prefixes = request_args[3];

        // Parse responses and look for the response;
        for (i = 0; i < responses_array.length; i += 1) {
            response = responses_array[i];

            Snog.log(response);

            // Check if response is an error;
            if (response.message_type === "error") {
                // check for unauthorized callback it has priority over all other callbacks
                switch (response.error_type) {
                    case "unauthorized":
                        callback_name = "unauthorized_callback";
                        break;
                    case "server":
                        callback_name = "server_error_callback";
                        break;
                    default :
                        // check error types, if there are no predefined error types, use default error type callback;
                        // in addition add prefixes to the end;
                        if (error_types !== null && error_types.indexOf(response.error_type) !== -1) {
                            callback_name = request.message_type + "_error" + (prefixes === null ? "_callback" : (prefixes.length > 1 ? prefixes[1] : prefixes[0]) );
                        } else {

                            // use default error type for callback;
                            callback_name = response.error_type + '_callback';
                        }
                        break;
                }
            } else {

                // check if message type is in expected array;
                var types = jQuery.isArray( response_message_types) ? response_message_types : [response_message_types];
                if (types.indexOf(response.message_type) !== -1) {

                    // Response message type is always mapped to 0 prefix;
                    callback_name = response.message_type + (prefixes === null ? "_callback" : prefixes[0]);
                } else {
                    callback_name = response.message_type + "_callback";
                }
            }

            exports.applyCallback(callback_name, request, response, request_args);
        }
    };

    /**
     * AJAX Error handler;
     *
     * @param jqXHR
     * @param textStatus
     * @param errorThrown
     */
    exports.onAJAXError = function (jqXHR, textStatus, errorThrown) {
        Snog.log(errorThrown);
    };
});/**
 * Handlers module provides all listeners;
 *
 * Here we set most of the listeners to handle Snog.events and
 * send correlated requests to the server;
 *
 */
Snog.define("handlers", function (require, exports, module) {

    // force to check security;
    jQuery.support.cors = true;

    var snog_api = require('api');
    var snog_data = require('data');
    var snog_dispatcher = require('dispatcher');
    var arguments_error = "Incorrect data arguments";

    //--------------------------------------------------------------------------------------------
    // Setup listeners
    //--------------------------------------------------------------------------------------------

    /**
     * Ping listener;
     * Through the ping we get piggybacking messages;
     *    data params: null;
     */
    snog_dispatcher.on(Snog.events.PING, function () {
        var request = snog.pingMessage();
        snog_api.applyAJAX(request, 'pong', null, null);
    });

    //--------------------------------------------------------------------------------------------
    // Login / SignUp / Logout
    //--------------------------------------------------------------------------------------------

    /**
     * SignIn listener;
     *    data params:
     *        auth_challenge_id
     *        challenge_response
     *        email
     *        password
     *        first_name
     *        last_name
     */
    snog_dispatcher.on(Snog.events.SIGN_UP, function (data) {
        if (data &&
            data.hasOwnProperty("auth_challenge_id") &&
            data.hasOwnProperty("challenge") &&
            data.hasOwnProperty("challenge_response") &&
            data.hasOwnProperty("email") &&
            data.hasOwnProperty("password") &&
            data.hasOwnProperty("first_name") &&
            data.hasOwnProperty("last_name") ) {
            var request = snog.signupAndLoginMessage(data.auth_challenge_id, data.challenge, data.challenge_response, data.email, data.password, data.first_name, data.last_name);

            // send request to the server;
            snog_api._authorizing = true;
            snog_api.applyAJAX(request, 'login_success', ['bad_challenge_response', 'signup_error'], null);
            return;
        }

        snog_dispatcher.broadcast(Snog.events.SIGN_UP_ERROR, {error_context: arguments_error + " auth_challenge_id, challenge_response, email, password, first_name, last_name"});
    });

    /**
     * Login listener;
     *    data params:
     *        email;
     *        password;
     */
    snog_dispatcher.on(Snog.events.LOGIN, function (data) {
        if (snog_api.isConnected() && data ) {
            var e = (data.email === "" || data.email === undefined) ? null : data.email;
            var p = (data.password === "" || data.password === undefined) ? null : data.password;
            if (e !== null && p !== null) {

                snog_data.player_email = data.email;

                // store player_email;
                if (jQuery.cookie && snog_data.keepUserLoggedIn) {
                    jQuery.cookie('snog_player_email', data.email, { path: '/' });
                }

                // send request to the server;
                var request = snog.loginMessage(data.email, data.password);
                snog_api._authorizing = true;
                snog_api.applyAJAX(request, 'login_success', ['login_error'], null);
                return;
            }
        }

        snog_dispatcher.broadcast(Snog.events.LOGIN_ERROR, {
            message_type : "error",
            error_type   : "login_error",
            error_context: arguments_error + " email, password"
        });
    });

    /**
     * Logout listener;
     *    data params: null;
     */
    snog_dispatcher.on(Snog.events.LOGOUT, function () {
        var request = snog.logoutMessage();

        // disconnect web_sockets before the logout;
        // when server does logout, we get onclose function call before the callback;
        require('web_socket').disconnect();

        // send request to the server;
        snog_api.applyAJAX(request, 'logout_success', null, null);
    });

    /**
     * Auto login listener;
     * Process automatic login using cookies 'player_email' and 'auth_token'
     *    data params: null;
     */
    snog_dispatcher.on(Snog.events.AUTO_LOGIN, function () {

        // restore player's email from the cookies;
        if ( jQuery.cookie ) {
            if (snog_data.player_id === null) {
                snog_data.player_id = parseInt(jQuery.cookie('snog_player_id'), 10);
            }

            // restore player's auth token from the cookies;
            if (snog_data.auth_token === null) {
                snog_data.auth_token = jQuery.cookie('snog_auth_token');
            }
        }

        if (snog_data.player_id !== null && snog_data.auth_token !== null) {
            var request = snog.autoLoginMessage(snog_data.player_id, snog_data.auth_token);

            // send request to the server;
            snog_api._authorizing = true;
            snog_api.applyAJAX(request, 'login_success', ['login_error', 'server_error'], ['_auto_callback']);
        } else {
            snog_dispatcher.broadcast(Snog.events.AUTO_LOGIN_ERROR, {error_context: "player_id auth_token is null"});
        }
    });

    /**
     * Send request to reset user's password;
     * Process automatic login using cookies 'player_email' and 'auth_token'
     *    data params:
     *            - auth_challenge_id;
     *            - auth_challenge_response;
     *            - email;
     */
    snog_dispatcher.on(Snog.events.RESET_PASSWORD, function (data) {
        if (data &&
            data.hasOwnProperty("challenge") &&
            data.hasOwnProperty("auth_challenge_id") &&
            data.hasOwnProperty("challenge_response") &&
            data.hasOwnProperty("email") ) {
            var request = snog.passwordForgottenMessage(data.auth_challenge_id, data.challenge_response, data.email);

            // todo: hack, fix when new messages are generated
            request.challenge = data.challenge;

            // send request to the server;
            snog_api.applyAJAX(request, 'temporary_password_sent_callback', ['password_forgotten_error'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.RESET_PASSWORD_ERROR, {error_context: arguments_error + " auth_challenge_id, auth_challenge_response, email"});
        }
    });

    /**
     * Send request to change user's password;
     *    data params:
     *            - new_password;
     */
    snog_dispatcher.on(Snog.events.CHANGE_PASSWORD, function (data) {
        if (data && data.hasOwnProperty("new_password" )) {
            var request = snog.changePasswordMessage(data.new_password);
            snog_api.applyAJAX(request, "password_changed", ['bad_password'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.CHANGE_PASSWORD_ERROR, {error_context: arguments_error + " new_password"});
        }
    });

    //--------------------------------------------------------------------------------------------
    // Item / Batch / Board
    //--------------------------------------------------------------------------------------------

    /**
     * Load player's inventory listener;
     *    data params: null;
     */
    snog_dispatcher.on(Snog.events.GET_PLAYER_INVENTORY, function () {
        var request = snog.getPlayerInventoryMessage();

        // send request to the server;
        snog_api.applyAJAX(request, 'bag', ['bag_error', 'unauthorized'], null);
    });

    /**
     * Read item instance handler;
     *    data params:
     *        item_instance_uuid
     */
    snog_dispatcher.on(Snog.events.READ_ITEM_INSTANCE, function (data) {
        if (data && data.hasOwnProperty("item_instance_uuid")) {
            var request = snog.readItemInstanceMessage(data.item_instance_uuid);

            // send request to the server;
            snog_api.applyAJAX(request, 'item_instance', ['item_instance_error'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.READ_ITEM_INSTANCE_ERROR, {error_context: arguments_error + " item_instance_uuid"});
        }
    });

    /**
     * Read item;
     *     data params:
     *         item_ref
     */
    snog_dispatcher.on(Snog.events.READ_ITEM, function (data) {
        if (data && data.hasOwnProperty("item_ref")) {
            var request = snog.readItemMessage(data.item_ref);

            // send request to the server;
            snog_api.applyAJAX(request, 'item', null, null);
        } else {
            snog_dispatcher.broadcast(Snog.events.READ_ITEM_ERROR, {error_context: arguments_error + " item_ref"});
        }
    });

    /**
     * Take an item from the batch to inventory;
     *    data params:
     *        item_instance_uuid;
     *        batch_uuid;
     *
     * !!!! IMPORTANT !!!!
     *
     * Server may not be able to handle multiple requests at the same time;
     * That is why we have to wait for response and only than take the next item;
     */
    snog_dispatcher.on(Snog.events.TAKE_ITEM_FROM_BATCH, function (data) {
        if (data && data.hasOwnProperty("item_instance_uuid") && data.hasOwnProperty("batch_uuid")) {
            var request = snog.takeItemInstanceFromBatchMessage(data.batch_uuid, data.item_instance_uuid);

            // send request to the server;
            snog_api.applyAJAX(request, 'item_instance_taken', ['inventory_full', 'item_instance_not_taken',
                                                               'item_instance_not_in_batch', 'bag_full'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.TAKE_ITEM_FROM_BATCH_ERROR, {error_context: arguments_error + " item_instance_uuid, batch_uuid"});
        }
    });

    /**
     * Take an item from IGM to inventory;
     *    data params:
     *        igm_id;
     *        message_attachment_id
     */
    snog_dispatcher.on(Snog.events.TAKE_ITEM_FROM_IGM, function (data) {
        if (data && data.hasOwnProperty("igm_id") && data.hasOwnProperty("message_attachment_id")) {
            var request = snog.takeItemInstanceFromIgmMessage(data.igm_id, data.message_attachment_id);

            // send request to the server;
            snog_api.applyAJAX(request, 'item_instance_taken', ['inventory_full', 'item_instance_not_in_batch',
                                                               'item_instance_not_taken', 'bag_full'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.TAKE_ITEM_FROM_IGM, {error_context: arguments_error + " igm_id, message_attachment_id"});
        }
    });

    /**
     * Drop an inventory item listener;
     *    data params:
     *        slot_id -> id of the slot in bag;
     */
    snog_dispatcher.on(Snog.events.DROP_INVENTORY_ITEM, function (data) {
        if (data && data.hasOwnProperty("slot_id")) {
            if (snog_data === undefined) {
                throw new Error("snog_data.js is not used. Use Snog.events.DROP_ITEM event");
            }

            var item = snog_data.player_inventory.getSlotByID(parseInt(data.slot_id, 10));
            var request = snog.dropItemInstanceMessage(snog_data.player_inventory.bag_id, item.slot_id, item.item_instance.item_instance_uuid);

            // send request to the server;
            snog_api.applyAJAX(request, 'item_instance_dropped', ['bag_error'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.DROP_INVENTORY_ITEM_ERROR, {error_context: arguments_error + " slot_id"});
        }
    });

    /**
     * Drop an inventory item listener;
     *    data params:
     *        bag_id -> unique bag_id;
     *        slot_id -> id of the slot in bag;
     *        item_instance_uuid (optional);
     */
    snog_dispatcher.on(Snog.events.DROP_ITEM, function (data) {
        if (data && data.hasOwnProperty("slot_id") && data.hasOwnProperty("bag_id")) {

            // item instance id is not defined, find it using slot_id data;
            if (!data.hasOwnProperty('item_instance_uuid')) {
                if (snog_data === null) {
                    throw new Error("snog_data.js is required if data.item_instance_uuid === null");
                }

                var board = snog_data.boards.getPlayerBoards(snog_data.player_id);
                var boards_instance_bag = board.getBagByID(parseInt(data.bag_id, 10));
                var slot = boards_instance_bag.getSlotByID(data.slot_id);

                if (slot.item_instance === null) {
                    throw new Error("Try to drop empty item");
                }

                data.item_instance_uuid = slot.item_instance.item_instance_uuid;
            }

            var request = snog.dropItemInstanceMessage(parseInt(data.bag_id, 10), parseInt(data.slot_id, 10), data.item_instance_uuid);

            // send request to the server;
            snog_api.applyAJAX(request, 'item_instance_dropped', ['bag_error'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.DROP_ITEM_ERROR, {error_context: arguments_error + " bag_id and slot_id, item_instance_uuid (optional)"});
        }
    });

    /**
     * Swap / move items from one bag into another;
     *   data params:
     *        from_bag_id
     *        from_slot_id
     *        from_item_instance_uuid
     *        to_bag_id
     *        to_slot_id
     *        to_item_instance_uuid
     */
    snog_dispatcher.on(Snog.events.SWAP_ITEM_INSTANCES, function (data) {
        if (data &&
            data.hasOwnProperty("from_bag_id") &&
            data.hasOwnProperty("to_bag_id") &&
            data.hasOwnProperty("from_item_instance_uuid") &&
            data.hasOwnProperty("from_slot_id") &&
            data.hasOwnProperty("to_slot_id")) {
            var request = snog.swapItemInstancesMessage(parseInt(data.from_bag_id, 10), parseInt(data.from_slot_id, 10), data.from_item_instance_uuid, parseInt(data.to_bag_id, 10), parseInt(data.to_slot_id, 10), data.to_item_instance_uuid);

            // send request to the server;
            snog_api.applyAJAX(request, 'item_instances_swapped', ['bag_error', 'bag_full'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.SWAP_ITEM_INSTANCES_ERROR, {error_context: arguments_error + " from_bag_id, from_slot_id, from_item_instance_uuid, to_bag_id, to_slot_id, to_item_instance_uuid"});
        }
    });

    /**
     * Gift an item to a player;
     *    data params:
     *        bag_id;
     *        slot_id;
     *        item_instance_uuid;
     *        player_id;
     *        message (optional);
     */
    snog_dispatcher.on(Snog.events.GIFT_ITEM, function (data) {
        if (data &&
            data.hasOwnProperty("bag_id") &&
            data.hasOwnProperty("slot_id") &&
            data.hasOwnProperty("item_instance_uuid") &&
            data.hasOwnProperty("player_id")) {

            var text = data.hasOwnProperty("message") ? data.message : "";
            var request = snog.giftItemInstanceMessage(data.bag_id, data.slot_id, data.item_instance_uuid, parseInt(data.player_id, 10), text);

            // send request to the server;
            snog_api.applyAJAX(request, 'item_instance_gifted', ['bag_error', 'gifting_error'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.GIFT_ITEM_ERROR, {error_context: arguments_error + " bag_id, slot_id, item_instance_uuid, player_id, message (optional)"});
        }
    });

    /**
     * Gift an item to a player via email;
     *    data params:
     *        bag_id;
     *        slot_id;
     *        item_instance_uuid;
     *        email;
     *        message (optional);
     */
    snog_dispatcher.on(Snog.events.GIFT_ITEM_VIA_EMAIL, function (data) {
        if (data &&
            data.hasOwnProperty("bag_id") &&
            data.hasOwnProperty("slot_id") &&
            data.hasOwnProperty("item_instance_uuid") &&
            data.hasOwnProperty("email")) {
            var text = data.hasOwnProperty("message") ? data.message : "";
            var request = snog.giftItemInstanceViaEmailMessage(data.bag_id, data.slot_id, data.item_instance_uuid, text, data.email);

            // send request to the server;
            snog_api.applyAJAX(request, 'item_instance_gifted', ['bag_error', 'gifting_error'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.GIFT_ITEM_ERROR, {error_context: arguments_error + " bag_id, slot_id, item_instance_uuid, email, message (optional)"});
        }
    });

    /**
     * Batch item listener;
     *    data params:
     *        size - size of the desired batch;
     *        ttl - time to live ( max 300 );
     */
    snog_dispatcher.on(Snog.events.GET_ITEM_BATCH, function (data) {
        if (data && data.hasOwnProperty("size") && data.hasOwnProperty("ttl")) {
            var request = snog.getItemBatchMessage(data.size, data.ttl);

            // send request to the server;
            snog_api.applyAJAX(request, 'item_instance_batch', ['invalid_batch_request', 'item_batch'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.GET_ITEM_BATCH_ERROR, {error_context: arguments_error + " size, ttl"});
        }
    });

    /**
     * Boards list listener;
     *    data:
     *        type
     *        filter
     */
    snog_dispatcher.on(Snog.events.GET_BOARDS_LIST, function (data) {
        if (data && data.hasOwnProperty("type") && data.hasOwnProperty("filter") ) {
            // read message from the server;
            var request = snog.listBoardsByTypeMessage(data.type, data.filter);

            // send request to the server;
            snog_api.applyAJAX(request, 'board_list', null, null);
        } else {
            snog_dispatcher.broadcast(Snog.events.GET_BOARDS_LIST_ERROR, {error_context: arguments_error + " type, filter"});
        }
    });

    /**
     * Create a board instance listener;
     *    data:
     *        board_ref
     */
    snog_dispatcher.on(Snog.events.CREATE_BOARD_INSTANCE, function (data) {
        if (data && data.hasOwnProperty("board_ref")) {
            // read message from the server;
            var request = snog.createBoardInstanceMessage(data.board_ref);

            // send request to the server;
            snog_api.applyAJAX(request, 'board_instance', ['board_instance_error'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.CREATE_BOARD_INSTANCE_ERROR, {error_context: arguments_error + " board_ref"});
        }
    });

    /**
     * Get board instances;
     *    data params:
     *        type
     *        player_id (optional);
     */
    snog_dispatcher.on(Snog.events.GET_BOARDS_INSTANCES, function (data) {
        if (data && data.hasOwnProperty("type")) {
            var pid = data.hasOwnProperty("player_id") ? data.player_id : snog_data.player_id;
            var request = snog.listBoardInstanceSlotsMessage(data.type, parseInt(pid, 10));

            // send request to the server;
            snog_api.applyAJAX(request, 'board_instance_slot_list', null, null);
        } else {
            snog_dispatcher.broadcast(Snog.events.GET_BOARDS_INSTANCES_ERROR, {error_context: arguments_error + " type, player_id (optional)"});
        }
    });

    /**
     * Get board instances;
     *    data params:
     *        board_instance_id
     */
    snog_dispatcher.on(Snog.events.READ_BOARD_INSTANCE, function (data) {
        if (data && data.hasOwnProperty("board_instance_id")) {
            var request = snog.readBoardInstanceBagMessage(data.board_instance_id);

            // send request to the server;
            snog_api.applyAJAX(request, 'board_instance', ['board_instance_error'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.READ_BOARD_INSTANCE_ERROR, {error_context: arguments_error + " board_instance_id"});
        }
    });

    /**
     * Update board comment listener;
     *    data params:
     *        board_instance_id
     *        comment (optional)
     */
    snog_dispatcher.on(Snog.events.UPDATE_BOARD_INSTANCE_COMMENT, function (data) {
        if (data && data.hasOwnProperty("board_instance_id")) {
            var comment = data.hasOwnProperty("comment") ? data.comment : "";
            var request = snog.updateBoardInstanceCommentMessage(data.board_instance_id, comment);

            // send request to the server;
            snog_api.applyAJAX(request, 'board_instance_comment_updated', ['board_instance_error'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.UPDATE_BOARD_INSTANCE_COMMENT_ERROR, {error_context: arguments_error + " board_instance_id, comment (optional)"});
        }
    });

    /**
     * Lock board instance listener;
     *    data params:
     *        board_instance_id
     *        comment (optional)
     */
    snog_dispatcher.on(Snog.events.LOCK_BOARD_INSTANCE, function (data) {
        if (data && data.hasOwnProperty("board_instance_id")) {
            var comment = data.hasOwnProperty("comment") ? data.comment : "";
            var request = snog.lockBoardInstanceMessage(data.board_instance_id, comment);

            // send request to the server;
            snog_api.applyAJAX(request, 'board_instance_locked', ['board_instance_error'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.LOCK_BOARD_INSTANCE_ERROR, {error_context: arguments_error + " board_instance_id, comment (optional)"});
        }
    });

    /**
     * Unlock board instance listener;
     *    data params:
     *        board_instance_id
     */
    snog_dispatcher.on(Snog.events.UNLOCK_BOARD_INSTANCE, function (data) {
        if (data && data.hasOwnProperty("board_instance_id")) {
            var request = snog.unlockBoardInstanceMessage(data.board_instance_id);

            // send request to the server;
            snog_api.applyAJAX(request, 'board_instance_unlocked', ['board_instance_error'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.UNLOCK_BOARD_INSTANCE_ERROR, {error_context: arguments_error + " board_instance_id"});
        }
    });

    /**
     * Unlock board instance listener;
     *    data params:
     *        board_instance_id
     */
    snog_dispatcher.on(Snog.events.DELETE_BOARD_INSTANCE, function (data) {
        if (data && data.hasOwnProperty("board_instance_id")) {
            var request = snog.deleteBoardInstanceMessage(data.board_instance_id);

            // send request to the server;
            snog_api.applyAJAX(request, 'board_instance_deleted', ['board_instance_error'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.DELETE_BOARD_INSTANCE_ERROR, {error_context: arguments_error + " board_instance_id"});
        }
    });

    /**
     * Get board instance bag;
     *    data params:
     *        board_instance_id ->
     *        player_id (optional);
     */
    snog_dispatcher.on(Snog.events.LOAD_BOARD_INSTANCE_BAG, function (data) {
        if (data && data.hasOwnProperty("board_instance_id")) {
            var pid = data.hasOwnProperty("player_id") ? data.player_id : snog_data.player_id;
            var request = snog.readBoardInstanceAndBagMessage(parseInt(pid, 10), data.board_instance_id);

            // send request to the server;
            snog_api.applyAJAX(request, 'bag', ['board_instance_error'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.LOAD_BOARD_INSTANCE_BAG_ERROR, {error_context: arguments_error + " board_instance_id, player_id (optional)"});
        }
    });

    //--------------------------------------------------------------------------------------------
    // Profile
    //--------------------------------------------------------------------------------------------

    /**
     * Read player status
     *    data params:
     *        player_id (optional)
     */
    snog_dispatcher.on(Snog.events.READ_PLAYER_STATUS, function (data) {
        var pid = (data && data.hasOwnProperty("player_id")) ? data.player_id : snog_data.player_id;
        var request = snog.readStatusMessageMessage(parseInt(pid, 10));

        // send request to the server;
        snog_api.applyAJAX(request, 'status_message', null, null);
    });

    /**
     *  Load player's profile;
     *    data params:
     *        player_id (optional)
     */
    snog_dispatcher.on(Snog.events.READ_PLAYER_PROFILE, function (data) {
        var pid = (data && data.hasOwnProperty("player_id")) ? data.player_id : snog_data.player_id;

        // set loading state;
        if (snog_data.profiles !== undefined) {
            var player = snog_data.profiles.getPlayerProfileByID(pid);
            if (player !== null) {
                player.isLoading = true;
            }
        }

        var request = snog.readProfileMessage(parseInt(pid, 10));

        // send request to the server;
        snog_api.applyAJAX(request, 'profile', ['profile_error', 'profile_not_found'], null);
    });

    /**
     *  Update player's profile;
     *    data params:
     *        first_name
     *        last_name
     *        privacy (optional)
     *        gender (optional)
     *        city (optional)
     *        country_code (optional)
     *        birth_year (optional)
     *        birth_month (optional)
     *        birth_day (optional)
     */
    snog_dispatcher.on(Snog.events.UPDATE_PLAYER_PROFILE, function (data) {
        if (data &&
            data.hasOwnProperty("first_name") &&
            data.hasOwnProperty("last_name")) {

            var privacy = data.hasOwnProperty("privacy") ? data.privacy : true;
            var gender = data.hasOwnProperty("gender") ? data.gender : null;
            var city = data.hasOwnProperty("city") ? data.city : "";
            var country_code = data.hasOwnProperty("country_code") ? data.country_code : "";
            var birth_year = data.hasOwnProperty("birth_year") ? data.birth_year : null;
            var birth_month = data.hasOwnProperty("birth_month") ? data.birth_month : null;
            var birth_day = data.hasOwnProperty("birth_day") ? data.birth_day : null;
            var request = snog.updateProfileMessage(snog_data.player_id, data.first_name, data.last_name, privacy, gender, city, country_code, birth_year, birth_month, birth_day);

            // send request to the server;
            snog_api.applyAJAX(request, 'profile', ['profile_error', 'profile_not_found'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.UPDATE_PLAYER_PROFILE_ERROR, {error_context: arguments_error + " first_name, last_name, privacy (optional), gender (optional), city (optional), country_code (optional), birth_year (optional), birth_month (optional), birth_day (optional)"});
        }
    });

    /**
     * Update player's avatar;
     *    data params:
     *        avatar_uri
     */
    snog_dispatcher.on(Snog.events.UPDATE_PLAYER_AVATAR, function (data) {
        if (data && data.hasOwnProperty("avatar_uri")) {

            // store avatar's url as a temporary. CDN takes time to upload a new image.
            // on next run - correct CDN url will be used for the player's image.
            snog_data.temp_avatar_uri = data.avatar_uri;
            var request = snog.updateProfileAvatarMessage(data.avatar_uri);

            // send request to the server;
            snog_api.applyAJAX(request, 'avatar_updated', ['avatar_update_error'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.UPDATE_PLAYER_AVATAR_ERROR, {error_context: arguments_error + " avatar_uri"});
        }
    });

    //--------------------------------------------------------------------------------------------
    // Messages
    //--------------------------------------------------------------------------------------------

    /**
     *  Load player's inbox messages;
     *    data params: null;
     */
    snog_dispatcher.on(Snog.events.LOAD_INBOX_MESSAGES, function () {
        var request = snog.getIgmInboxMessage();

        // send request to the server;
        snog_api.applyAJAX(request, 'igm_inbox', null, null);
    });

    /**
     *  Load player's inbox messages;
     *    data params: null;
     */
    snog_dispatcher.on(Snog.events.LOAD_OUTBOX_MESSAGES, function () {
        var request = snog.getIgmOutboxMessage();

        // send request to the server;
        snog_api.applyAJAX(request, 'igm_outbox', null, null);
    });

    /**
     *  Load player's inbox messages by page;
     *    data params:
     *      - page_index {Number}
     *      - page_size  {Number}
     */
    snog_dispatcher.on(Snog.events.LOAD_PAGED_INBOX_MESSAGES, function (data) {
        if ( data && data.hasOwnProperty('page_index') && data.hasOwnProperty('page_size')) {
            var request = snog.getPagedIgmInboxMessage(data.page_index, data.page_size);
            // send request to the server;
            snog_api.applyAJAX(request, 'igm_inbox', null, null);
        } else {
            snog_dispatcher.broadcast(Snog.events.LOAD_PAGED_INBOX_MESSAGES_ERROR, {error_context: arguments_error + " page_index or page_size"});
        }
    });

    /**
    *  Load player's outbox messages by page;
    *    data params:
    *      - page_index {Number}
    *      - page_size  {Number}
    */
    snog_dispatcher.on(Snog.events.LOAD_PAGED_OUTBOX_MESSAGES, function (data) {
        if ( data && data.hasOwnProperty('page_index') && data.hasOwnProperty('page_size')) {
            var request = snog.getPagedIgmOutboxMessage(data.page_index, data.page_size);
            // send request to the server;
            snog_api.applyAJAX(request, 'igm_outbox', null, null);
        } else {
            snog_dispatcher.broadcast(Snog.events.LOAD_PAGED_OUTBOX_MESSAGES_ERROR, {error_context: arguments_error + " page_index or page_size"});
        }
    });

    /**
     * Read user's message;
     *    data params:
     *        igm_id - id of in game message;
     */
    snog_dispatcher.on(Snog.events.READ_MESSAGE, function (data) {
        if (data && data.hasOwnProperty("igm_id")) {
            var cached_message = snog_data.player_messages.inboxMessages.getMessageByID(data.igm_id);
            if (cached_message !== null && cached_message.view === "full") {
                // broadcast cached message;
                snog_dispatcher.broadcast(Snog.events.READ_MESSAGE_SUCCESS, cached_message);
            } else {
                var request = snog.readIgmMessage(parseInt(data.igm_id, 10));

                // send request to the server;
                snog_api.applyAJAX(request, 'igm', ['igm_not_found'], null);
            }
        } else {
            snog_dispatcher.broadcast(Snog.events.READ_MESSAGE_ERROR, {error_context: arguments_error + " igm_id"});
        }
    });

    /**
     * Delete user's message;
     *    data params:
     *        igm_id - id of in game message;
     */
    snog_dispatcher.on(Snog.events.DELETE_MESSAGE, function (data) {
        if (data && data.hasOwnProperty("igm_id") ) {
            var request = snog.deleteIgmMessage(parseInt(data.igm_id, 10));

            // send request to the server;
            snog_api.applyAJAX(request, 'acknowledgement', null, null);
        } else {
            snog_dispatcher.broadcast(Snog.events.DELETE_MESSAGE_ERROR, {error_context: arguments_error + " igm_id"});
        }
    });

    /**
     * Load player's friends;
     *    data params:
     *        player_id (optional);
     */
    snog_dispatcher.on(Snog.events.LOAD_FRIENDS, function (data) {
        var pid = (data && data.hasOwnProperty("player_id")) ? data.player_id : snog_data.player_id;
        var request = snog.getFriendsListMessage(parseInt(pid, 10));

        // send request to the server;
        snog_api.applyAJAX(request, 'friends_list', null, null);
    });

    /**
     * Request a friendship;
     *    data params:
     *        player_id;
     */
    snog_dispatcher.on(Snog.events.PROPOSE_FRIENDSHIP, function (data) {
        if (data && data.hasOwnProperty("player_id")) {
            var request = snog.proposeFriendshipMessage(parseInt(data.player_id, 10));

            // send request to the server;
            snog_api.applyAJAX(request, 'friend_request_sent', null, null);
        } else {
            snog_dispatcher.broadcast(Snog.events.PROPOSE_FRIENDSHIP_ERROR, {error_context: arguments_error + " player_id"});
        }
    });

    /**
     *  Request authorization challenge from the server ( captcha );
     *    data params: null;
     */
    snog_dispatcher.on(Snog.events.NEW_AUTH_CHALLENGE_REQUEST, function () {
        var request = snog.newAuthChallengeMessage();

        // send request to the server;
        snog_api.applyAJAX(request, 'auth_challenge', null, null);
    });

    /**
     * Debug something;
     *    data params:
     *        message - string message to snog_core.debug;
     */
    snog_dispatcher.on(Snog.events.DEBUG, function (data) {
        if ( data && data.hasOwnProperty("message") ) {
            Snog.log(data.message);
        }
    });

    /**
     * Load rewards list;
     *    data params: null;
     */
    snog_dispatcher.on(Snog.events.GET_REWARDS, function () {
        var request = snog.listAllRewardsMessage();

        // send request to the server;
        snog_api.applyAJAX(request, 'rewards_list', null, null);
    });

    /**
     * Load player's rewards;
     *    data params:
     *        - player_id (optional)
     */
    snog_dispatcher.on(Snog.events.GET_REWARD_INSTANCES, function (data) {
        var pid = (data && data.hasOwnProperty("player_id")) ? data.player_id : snog_data.player_id;
        var request = snog.listRewardInstancesMessage(pid);

        // send request to the server;
        snog_api.applyAJAX(request, 'reward_instances_list', null, null);
    });

    /**
     * Send a message reply;
     *    data params:
     *        igm_id
     *        body
     */
    snog_dispatcher.on(Snog.events.REPLY_MESSAGE, function (data) {
        if (data &&
            data.hasOwnProperty("igm_id") &&
            data.hasOwnProperty("body")) {
            var request = snog.replyIgmMessage(parseInt(data.igm_id, 10), data.body);

            // send request to the server;
            snog_api.applyAJAX(request, 'acknowledgement', null, null);
        } else {
            snog_dispatcher.broadcast(Snog.events.REPLY_MESSAGE_ERROR, {error_context: arguments_error + " igm_id, body"});
        }
    });

    /**
     * Send a new IGM;
     *    data params:
     *       type
     *       to_player_id
     *       title
     *       body
     */
    snog_dispatcher.on(Snog.events.NEW_IGM, function (data) {
        if (data &&
            data.hasOwnProperty("type") &&
            data.hasOwnProperty("to_player_id") &&
            data.hasOwnProperty("title") &&
            data.hasOwnProperty("body")) {
            var request = snog.newIgmMessage(data.type, parseInt(data.to_player_id, 10), data.title, data.body);

            // send request to the server;
            snog_api.applyAJAX(request, 'acknowledgement', ['igm_to_self', 'igm_unauthorized_send', 'igm_unsupported_type'], null);
        } else {
            snog_dispatcher.broadcast(Snog.events.NEW_IGM_ERROR, {error_context: arguments_error + " type, to_player_id, title, body"});
        }
    });

    /**
     * Calculate board compatibility;
     *     data params:
     *        board_instance_id
     */
    snog_dispatcher.on(Snog.events.CALCULATE_COMPATIBILITY, function (data) {
        if (data && data.hasOwnProperty("board_instance_id")) {
            var request = snog.calculateCompatibilityMessage(data.board_instance_id);

            // send request to the server;
            snog_api.applyAJAX(request, 'acknowledgement', null, null);
        } else {
            snog_dispatcher.broadcast(Snog.events.CALCULATE_COMPATIBILITY_ERROR, {error_context: arguments_error + " board_instance_id"});
        }
    });

    /**
     * Find players request
     *     data params:
     *        search_terms
     */
    snog_dispatcher.on(Snog.events.FIND_PLAYERS, function (data) {
        if (data && data.hasOwnProperty("search_terms")) {
            var request = snog.findPlayersMessage(data.search_terms);

            // send request to the server;
            snog_api.applyAJAX(request, 'acknowledgement', null, null);
        } else {
            snog_dispatcher.broadcast(Snog.events.FIND_PLAYERS_ERROR, {error_context: arguments_error + " search_terms"});
        }
    });

    /**
     * Request to get leader board;
     *      data params:
     *          type
     *          board_ref (optional)
     *          board_refs (optional)
     *          filter (optional)
     *          page  (optional)
     *          page_size (optional)
     */
    snog_dispatcher.on(Snog.events.GET_LEADERBOARD, function (data) {
        if (data && data.hasOwnProperty("type")) {
            var request = snog.getLeaderboardMessage(data.type, data.board_ref, data.board_refs, data.filter, data.page, data.page_size);

            // send request to the server;
            snog_api.applyAJAX(request, 'leaderboard', null, null);
        } else {
            snog_dispatcher.broadcast(Snog.events.GET_LEADERBOARD_ERROR, {error_context: arguments_error + " type, board_ref (optional), board_refs (optional), filter (optional), page (optional), page_size (optional)"});
        }
    });

    //--------------------------------------------------------------------------------------------
    // Milestones
    //--------------------------------------------------------------------------------------------

    /**
     * Request to get milestones;
     *      data params: null
     */
    snog_dispatcher.on(Snog.events.GET_MILESTONES, function () {
        var request = snog.listMilestonesMessage();
        snog_api.applyAJAX(request, 'list_milestones', null, null);
    });

    /**
     *  Request to get a single milestone;
     *      data params:
     *          milestone_ref
     */
    snog_dispatcher.on(Snog.events.READ_MILESTONE, function (data) {
        if (data && data.hasOwnProperty("milestone_ref")) {
            var request = snog.readMilestoneMessage(data.milestone_ref);
            snog_api.applyAJAX(request, 'milestone', null, null);
        } else {
            snog_dispatcher.broadcast(Snog.events.READ_MILESTONE_ERROR, {error_context: arguments_error + " milestone_ref"});
        }
    });

    //--------------------------------------------------------------------------------------------
    // Preference
    //--------------------------------------------------------------------------------------------

    /**
     * Request to get player's preference;
     *      data params: null
     */
    snog_dispatcher.on(Snog.events.GET_PREFERENCE, function (data) {
        if (data && data.hasOwnProperty("key")) {
            var request = snog.getPreferenceMessage( data.key );
            snog_api.applyAJAX(request, 'preference', null, null);
        } else {
            snog_dispatcher.broadcast(Snog.events.GET_PREFERENCE_ERROR, {error_context: arguments_error + " key"});
        }
    });

    /**
     *  Request to set unique preference
     *      data params:
     *          key
     *          visibility
     *          value
     */
    snog_dispatcher.on(Snog.events.SET_PREFERENCE, function (data) {
        if (data && data.hasOwnProperty("key") && data.hasOwnProperty("visibility") && data.hasOwnProperty("value")) {
            var request = snog.setPreferenceMessage(data.key, data.visibility, data.value);
            snog_api.applyAJAX(request, 'preference_stored', null, null);
        } else {
            snog_dispatcher.broadcast(Snog.events.SET_PREFERENCE_ERROR, {error_context: arguments_error + " key, visibility or value"});
        }
    });

    /**
     * Request to redeem code
     *      data params:
     *          key {String}
     */
    snog_dispatcher.on(Snog.events.REDEEM_CODE, function(data) {
        if(data && data.hasOwnProperty("key")) {
            var request = snog.redeemCodeMessage(data.key);
            snog_api.applyAJAX(request, '', null, null);
        } else {
            snog_dispatcher.broadcast(Snog.events.REDEEM_CODE_ERROR, {error_context: arguments_error + " key"});
        }
    })
});
/**
 *  Extends Snog.events by adding realm events;
 */

//--------------------------------------------------------------------------------------------
// Realm event, params:
//                  - token
// Example:
// broadcast(Snog.events.REAL_LOGIN, { token: "You_Secret_Token" });
//--------------------------------------------------------------------------------------------

Snog.events.REALM_LOGIN = "REALM_LOGIN";                        // request to login with realm
Snog.events.REALM_LOGIN_SUCCESS = "REALM_LOGIN_SUCCESS";        // success response
Snog.events.REALM_LOGIN_FAILURE = "REALM_LOGIN_FAILURE";        // error response

/**
 * Realm module provides implementation of the realm login;
 */
Snog.define("realm", function (require, exports, module) {
    "use strict";

    module.exports = {
        realm : null,

        /**
         * Set Realm parameter for login;
         * @param realm
         */
        setLoginRealm : function (realm) {
            this.realm = realm;
        }
    };

    exports = module.exports;

    // Extend callbacks;
    var snog_callbacks = require("callbacks");
    var snog_dispatcher = require("dispatcher");
    var snog_api = require("api");

    /**
     * Realm login success callback;
     * @param response
     * @param request
     */
    snog_callbacks.login_success_realm_callback = function (response, request) {
        if (this.hasOwnProperty("login_success_callback")) {
            this.login_success_callback(response, request);
        }

        // change authorization flag
        snog_api._authorizing = false;

        if (request.realm !== undefined && request.realm === exports.realm) {
            snog_dispatcher.broadcast(Snog.events.REALM_LOGIN_SUCCESS, response);
        }

        // !!! IMPORTANT !!!
        // If user is authorized with Realm access token, there is no player's email address in response.
        // So, I need to read player's profile in order to get it and we'll be able to auto login next time;
        snog_dispatcher.broadcast(Snog.events.READ_PLAYER_PROFILE);
    };

    //--------------------------------------------------------------------------------------------
    //
    // Initialize;
    //
    //--------------------------------------------------------------------------------------------

    /**
     * Realm login event fired from the Flash;
     *    data params:
     *      - token: {String}
     */
    snog_dispatcher.on(Snog.events.REALM_LOGIN, function (data) {

        if (exports.realm === null) {
            throw new Error("Realm is not set");
        }

        if (data.token !== null) {
            var request = snog.loginFacebookConnectMessage(exports.realm, data.token);
            snog_api._authorizing = true;
            snog_api.applyAJAX(request, 'login_success', null, ["_realm_callback"]);
        } else {
            snog_dispatcher.broadcast(Snog.events.REALM_LOGIN_FAILURE, {error_context : "token is null"});
        }
    });
});
/**
 *  Extends Snog.events by adding facebook events;
 */
Snog.events.FACEBOOK_TOKEN = "FACEBOOK_TOKEN";                   // facebook token extracted from hash
Snog.events.FACEBOOK_GET_TOKEN = "FACEBOOK_GET_TOKEN";           // request to get facebook token
Snog.events.FACEBOOK_LOGIN = "FACEBOOK_LOGIN";                   // request to login with facebook
Snog.events.FACEBOOK_LOGIN_SUCCESS = "FACEBOOK_LOGIN_SUCCESS";   // success response
Snog.events.FACEBOOK_LOGIN_FAILURE = "FACEBOOK_LOGIN_FAILURE";   // error response
Snog.events.FACEBOOK_INVITE = "FACEBOOK_INVITE";                 // request to invite a friend with facebook
Snog.events.FACEBOOK_INVITE_SUCCESS = "FACEBOOK_INVITE_SUCCESS"; // success response
Snog.events.FACEBOOK_INVITE_FAILURE = "FACEBOOK_INVITE_FAILURE"; // error response
Snog.events.FACEBOOK_FIND_FRIENDS = "FACEBOOK_FIND_FRIENDS";     // response to find friends with facebook
Snog.events.FACEBOOK_FIND_FRIENDS_ACKNOWLEDGEMENT = "FACEBOOK_FIND_FRIENDS_ACKNOWLEDGEMENT"; // asynchronous acknowledgement response
Snog.events.FACEBOOK_GIFT = "FACEBOOK_GIFT";                     // request to gif an item with facebook
Snog.events.FACEBOOK_SHARE = "FACEBOOK_SHARE";                   // request to place a message on facebook wall

/**
 * Facebook module provides implementation of the facebook login;
 */
Snog.define("facebook", function (require, exports, module) {
    "use strict";

    module.exports = {

        client_id : null,
        actions   : {
            LOGIN : "login"
        },

        /**
         * Restore action from the cookies;
         */
        action : jQuery.cookie('snog_facebook_action'),
        realm  : "FacebookConnect",

        /**
         * if true AJAX is used to connect to the server;
         * Flash does login itself using AMF instead of JSON;
         * set to false if you login using SnogMessageLibrary;
         */
        useAJAX       : true,
        isLoginWithFB : false,

        //--------------------------------------------------------------------------------------------
        //
        // Functions
        //
        //--------------------------------------------------------------------------------------------

        /**
         * Get FB hash params;
         * @return {Object}
         */
        getHashParams : function () {
            var hashParams = {};
            var e, a = /\+/g, // Regex for replacing addition symbol with a space
                    r = /([^&;=]+)=?([^&;]*)/g, d = function (s) {
                        return decodeURIComponent(s.replace(a, " "));
                    }, q = window.location.hash.substring(1);

            while (e = r.exec(q)) {
                hashParams[d(e[1])] = d(e[2]);
            }

            return hashParams;
        },

        /**
         * Get stored facebook token;
         */
        getFacebookToken : function () {
            if (window.location.hash) {
                return this.getHashParams().access_token;
            }

            return null;
        },

        /**
         * Redirect to facebook;
         */
        openFacebook : function () {
            var redirect_url, facebook_url;
            redirect_url = window.location.protocol + '//' + window.location.hostname + window.location.pathname;
            facebook_url = "https://www.facebook.com/dialog/oauth?client_id=" + this.client_id + "&redirect_uri=" + redirect_url + "&response_type=token&scope=email,publish_stream";

            // store FB action, so on reload we try to re-login with FB;
            this.action = this.actions.LOGIN;
            jQuery.cookie('snog_facebook_action', this.action, { path: '/' });

            window.location.href = facebook_url;
        },

        /**
         * Clear last facebook action;
         */
        clearFacebookAction : function () {
            this.action = null;
            jQuery.cookie('snog_facebook_action', this.action, { path: '/' });
        },

        /**
         * Set unique client id, needed for the authorization;
         * @param id
         */
        setClientID : function (id) {
            this.client_id = id;
        }
    };

    exports = module.exports;

    // Extend callbacks;
    var snog_callbacks = require("callbacks");
    var snog_events = require("dispatcher");
    var snog_api = require("api");

    /**
     * Facebook login success callback;
     * @param response
     * @param request
     */
    snog_callbacks.login_success_facebook_callback = function (response, request) {
        if (this.hasOwnProperty("login_success_callback")) {
            this.login_success_callback(response, request);
        }

        if (request.realm !== undefined && request.realm === exports.realm) {
            // store flag that login was with facebook;
            exports.isLoginWithFB = true;

            // send FB login success event;
            snog_events.broadcast(Snog.events.FACEBOOK_LOGIN_SUCCESS, response);
        }

        // !!! IMPORTANT !!!
        // If user is authorized with Facebook access token, there is no player's email address in response.
        // So, I need to read player's profile in order to get it and we'll be able to auto login next time;
        snog_api._authorizing = false;
        snog_events.broadcast(Snog.events.READ_PLAYER_PROFILE);
    };

    /**
     * Facebook acknowledgement callback function;
     * @param response
     * @param request
     */
    snog_callbacks.acknowledgement_facebook_callback = function (response, request) {
        if (response.ack_type === "wilco" && response.ack_context === "find_external_friends") {
            snog_events.broadcast(Snog.events.FACEBOOK_FIND_FRIENDS_ACKNOWLEDGEMENT, response);
        } else {
            // call original callback;
            if (this.hasOwnProperty("acknowledgement_callback")) {
                this.acknowledgement_callback(response, request);
            }
        }
    };

    /**
     * Find external friends error callback;
     * @param response
     * @param request
     */
    snog_callbacks.find_external_friends_error_callback = function (response, request) {
        // normally there is no an error for async. find friends function;
        // just in case handle this callback;
        Snog.log("find_external_friends_error_callback " + response);
    };

    /**
     * Player invited callback
     * @param response
     * @param request
     */
    snog_callbacks.player_invited_facebook_callback = function (response, request) {
        snog_events.broadcast(Snog.events.FACEBOOK_INVITE_SUCCESS, response);
    };

    /**
     * Player invite error callback;
     * @param response
     * @param request
     */
    snog_callbacks.invite_new_player_error_callback = function (response, request) {
        snog_events.broadcast(Snog.events.FACEBOOK_INVITE_FAILURE, response);
    };

    //--------------------------------------------------------------------------------------------
    //
    // Initialize;
    //
    //--------------------------------------------------------------------------------------------

    /**
     * Facebook login event fired from the Flash;
     *    data params: null
     */
    snog_events.on(Snog.events.FACEBOOK_LOGIN, function () {
        // get facebook token from the hash;
        var token = exports.getFacebookToken();
        if (token) {
            exports.clearFacebookAction();

            // send event with facebook token;
            snog_events.broadcast(Snog.events.FACEBOOK_TOKEN, {token : token});

            // do authorization using AJAX;
            if (exports.useAJAX) {
                var request = snog.loginFacebookConnectMessage(exports.realm, token, null);

                // send request to the server;
                snog_api._authorizing = true;
                snog_api.applyAJAX(request, 'login_success', null, ["_facebook_callback"]);
            }
        } else {
            // token not found redirect to get one;
            exports.openFacebook();
        }
    });

    /**
     * Get FB token from the hash or open FB page;
     */
    snog_events.on(Snog.events.FACEBOOK_GET_TOKEN, function () {
        // get facebook token from the hash;
        var token = exports.getFacebookToken();
        if (token) {
            // send event width facebook token;
            // client or login use it to login;
            snog_events.broadcast(Snog.events.FACEBOOK_TOKEN, {token : token});
        } else {
            // token not found redirect to get one;
            exports.openFacebook();
        }
    });

    /**
     * Facebook find friends request;
     *    data params: null
     */
    snog_events.on(Snog.events.FACEBOOK_FIND_FRIENDS, function () {
        var request = snog.findExternalFriendsMessage(exports.realm, exports.getFacebookToken());

        // send request to the server;
        snog_api.applyAJAX(request, 'acknowledgement', ['unauthorized'], ["_facebook_callback"]);
    });

    /**
     * Invite a friend from facebook.
     * PS. We need to find_facebook_friends 1st, than we can invite them into the system.
     *     Each player's profile will be enriched with realm_id value;
     *
     *    data params:
     *        realm_id: -> obtained from the player's profile;
     */
    snog_events.on(Snog.events.FACEBOOK_INVITE, function (data) {
        if (data && data.realm_id !== undefined) {
            var request = snog.inviteNewPlayerMessage(exports.realm, data.realm_id, exports.getFacebookToken());

            // send request to the server;
            snog_api.applyAJAX(request, null, ['unauthorized'], ["_facebook_callback"]);
        }
    });

    /**
     * Send a gift to a friend;
     *    data params:
     *        bag_id
     *        slot_id
     *        item_instance_uuid
     *        realm_id
     *
     */
    snog_events.on(Snog.events.FACEBOOK_GIFT, function (data) {
        if (data && data.bag_id !== null && data.slot_id && data.item_instance_uuid && data.realm_id !== undefined) {
            var request = snog.giftItemInstanceToRealmUserMessage(data.bag_id, data.slot_id, data.item_instance_uuid, exports.realm, data.realm_id, exports.getFacebookToken());

            // send request to the server;
            snog_api.applyAJAX(request, 'item_instance_gifted', ['unauthorized', 'gifting_error', 'bag_error'], null);
        }
    });

    /**
     * Share a post on facebook;
     *         data params:
     *             share {Object}
     *                 img_uri;
     *                 name;
     *                 caption;
     *                 description;
     *                 link;
     */
    snog_events.on(Snog.events.FACEBOOK_SHARE, function (data) {
        var share = data.share;
        var url = "https://www.facebook.com/dialog/feed?app_id=" + exports.client_id + "&" + "picture=" + share.img_uri + "&" + "name=" + share.name + "&" + "caption=" + share.caption + "&" + "description=" + share.description + "&" + "link=" + share.link + "&" + "redirect_uri=" + share.link;

        // open new window;
        window.open(url);
    });
});
/**
 *  Extends events by adding twitter;
 */
//--------------------------------------------------------------------------------------------
// Twitter login event, params: null;
//
// Example:
// broadcast(Snog.events.TWITTER_LOGIN);
//--------------------------------------------------------------------------------------------
Snog.events.TWITTER_LOGIN = "TWITTER_LOGIN";
Snog.events.TWITTER_FORCE_LOGIN = "TWITTER_FORCE_LOGIN";
Snog.events.TWITTER_LOGIN_SUCCESS = "TWITTER_LOGIN_SUCCESS";
Snog.events.TWITTER_LOGIN_ERROR = "TWITTER_LOGIN_ERROR";
Snog.events.TWITTER_REDIRECT = "TWITTER_REDIRECT";

//--------------------------------------------------------------------------------------------
// Twitter share event, params:
//                          - text
//                          - url (optional)
// Example:
// broadcast(Snog.events.TWITTER_SHARE_VIA_WEB, { text: 'Hello here is your text', url: 'http://www.google.com' });
//--------------------------------------------------------------------------------------------
Snog.events.TWITTER_SHARE_VIA_WEB = "TWITTER_SHARE_VIA_WEB";
Snog.events.TWITTER_SHARE_SUCCESS = "TWITTER_SHARE_SUCCESS";

/**
 * Tweeter module provides implementation of login with Twitter;
 */
Snog.define("twitter", function (require, exports, module) {
    "use strict";

    var snog_dispatcher = require('dispatcher');

    module.exports = {

        realm: 'twitter',

        /**
         * Get twitter auth token
         *
         * @returns {String|null}
         */
        getAuthToken: function () {
            var hash = this._getSearchParams();
            return hash.hasOwnProperty('oauth_token') ? hash.oauth_token : null;
        },

        /**
         * Get twitter auth token verifier
         *
         * @returns {String|null}
         */
        getAuthVerifier: function () {
            var hash = this._getSearchParams();
            return hash.hasOwnProperty('oauth_verifier') ? hash.oauth_verifier : null;
        },

        /**
         * Check search for twitter redirect;
         *
         * @returns {boolean}
         */
        isRedirected: function () {
            return this.getAuthToken() !== null && this.getAuthVerifier() !== null;
        },

        /**
         * Get search params;
         *
         * @returns {{}}
         * @private
         */
        _getSearchParams: function () {
            var result = {};
            var e, a = /\+/g, // Regex for replacing addition symbol with a space
                r = /([^&;=]+)=?([^&;]*)/g, d = function (s) {
                    return decodeURIComponent(s.replace(a, " "));
                }, q = window.location.search.substring(1);

            while (e = r.exec(q)) {
                result[d(e[1])] = d(e[2]);
            }

            return result;
        }
    };

    exports = module.exports;

    //--------------------------------------------------------------------------------------------
    //
    // Callbacks;
    //
    //--------------------------------------------------------------------------------------------

    var snog_callbacks = require('callbacks');

    /**
     * Extend callback with login success message;
     *
     * @param {Object} response
     * @param {Object} request
     */
    snog_callbacks.login_success_twitter_callback = function (response, request) {
        // call original login_success;
        if (this.hasOwnProperty("login_success_callback")) {
            this.login_success_callback(response, request);
        }

        snog_dispatcher.b(Snog.events.TWITTER_LOGIN_SUCCESS, response);
    };

    /**
     * Extend callback with login redirect message;
     *
     * @param {Object} response
     * @param {Object} request
     */
    snog_callbacks.login_redirect_twitter_callback = function (response, request) {
        snog_dispatcher.b(Snog.events.TWITTER_REDIRECT, response);
    };

    /**
     * Expand callback for error login;
     * @param {Object} response
     * @param {Object} request
     */
    snog_callbacks.login_error_twitter_callback = function (response, request) {

        // call original server error callback;
        if (this.hasOwnProperty("login_error_callback")) {
            this.login_error_callback(response, request);
        }

        snog_dispatcher.b(Snog.events.TWITTER_LOGIN_ERROR, response);
    };

    //--------------------------------------------------------------------------------------------
    //
    // Handlers;
    //
    //--------------------------------------------------------------------------------------------

    var snog_api = require('api');

    /**
     * Twitter login event
     *    data params: null
     *
     * Try to get search params from the browser and use them to do authorization
     * If there are no params found server generates a redirect URL and we send TWITTER_REDIRECT event
     * If there are params - we try to use them and authorize in the system
     *      In the case of error a login_error_twitter_callback is executed and TWITTER_LOGIN_ERROR event is sent;
     */
    snog_dispatcher.on(Snog.events.TWITTER_LOGIN, function () {

        // get data from the hash;
        var token = exports.getAuthToken();
        var verifier = exports.getAuthVerifier();
        var request = snog.loginFacebookConnectMessage(exports.realm, null, null);

        if (token !== null) request.oauth_token = token;
        if (verifier !== null) request.oauth_verifier = verifier;

        // send request to the server;
        snog_api.applyAJAX(request, ['login_success', 'login_redirect'], ['server_error'], ["_twitter_callback"]);
    });

    /**
     * Force twitter login, do not check search params;
     */
    snog_dispatcher.on(Snog.events.TWITTER_FORCE_LOGIN, function () {
        var request = snog.loginFacebookConnectMessage(exports.realm, null, null);
        snog_api.applyAJAX(request, ['login_redirect'], null, ["_twitter_callback"]);
    });

    /**
     * Tweeter share event allow to publish a twit
     *         data required:
     *                 - text
     *                 - url ( optional )
     */
    snog_dispatcher.on(Snog.events.TWITTER_SHARE_VIA_WEB, function (data) {
        if (data !== null && data !== undefined) {
            var url = "https://twitter.com/intent/tweet?" + "original_referer=" + window.location.href + "&related=snoget&" + "text=" + data.text;

            if ( data.hasOwnProperty('url') ) {
                url += "&url=" + data.url;
            }

            // open window to post;
            window.open(url, '', 'width=550,height=420,scrollbars=yes,resizable=yes,toolbar=no,location=yes');
        }
    });
});
var snog = {};

/** Abandon friendship of current player towards another player.
 *
 * to_player_id : Player ID friendship will be abandoned with.
 */
snog.abandonFriendshipMessage = function (toPlayerID) {
    var msg = { 
        message_type : "abandon_friendship",
        to_player_id : toPlayerID
    };
    return msg;
}

/** Accepts friendship as requested in the specified IGM.
 *
 * igm_id : In-game message ID containing the friend request.
 */
snog.acceptFriendshipMessage = function (igmID) {
    var msg = { 
        message_type : "accept_friendship",
        igm_id : igmID
    };
    return msg;
}

/** Activates a new player.
 *
 * email : Email address activation message was sent to.
 * activation_key : Activation key contained in the activation message.
 */
snog.activatePlayerMessage = function (email, activationKey) {
    var msg = { 
        message_type : "activate_player",
        email : email,
        activation_key : activationKey
    };
    return msg;
}

/** Adds a new favorite of a certain type.
 *
 * type : Type of favorite to add, i.e. ``players``, ``board_instances``.
 * id : ID of favorite to add.
 */
snog.addFavoriteMessage = function (type, id) {
    var msg = { 
        message_type : "add_favorite",
        type : type,
        id : id
    };
    return msg;
}

/** Log user in the system with existing authentication token (i.e. auto login).
 *
 * player_id : The user's player ID.
 * auth_token : The user's authentication token.
 */
snog.autoLoginMessage = function (playerID, authToken) {
    var msg = { 
        message_type : "login",
        player_id : playerID,
        auth_token : authToken
    };
    return msg;
}

/** (DEPRECATED - use player_id instead of email) Log user in the system with existing authentication token (i.e. auto login).
 *
 * email : The user's email address.
 * auth_token : The user's authentication token.
 */
snog.autoLoginWithEmailMessage = function (email, authToken) {
    var msg = { 
        message_type : "login",
        email : email,
        auth_token : authToken
    };
    return msg;
}

/** Calculate how many points you would get for adding the given player as a friend.
 *
 * target_player_id : Player ID potential connection points will be calculated with.
 */
snog.calculatePotentialFriendshipConnectionPointsMessage = function (targetPlayerID) {
    var msg = { 
        message_type : "calculate_potential_friendship_points",
        target_player_id : targetPlayerID
    };
    return msg;
}

/** Changes the password of the authenticated user to new_password.
 *
 * new_password : Contains the new user chosen password.
 */
snog.changePasswordMessage = function (newPassword) {
    var msg = { 
        message_type : "change_password",
        new_password : newPassword
    };
    return msg;
}

/** Claim particular reward instance
 *
 * reward_instance_id : Reward instance ID to claim.
 */
snog.claimRewardInstanceMessage = function (rewardInstanceID) {
    var msg = { 
        message_type : "claim_reward_instance",
        reward_instance_id : rewardInstanceID
    };
    return msg;
}

/** Create a new board instance of the given board ref in the next available slot.
 *
 * board_ref : Reference string identifying the board to create.
 */
snog.createBoardInstanceMessage = function (boardRef) {
    var msg = { 
        message_type : "create_board_instance",
        board_ref : boardRef
    };
    return msg;
}

/** Delete a board instance, freeing up a slot for a new board instance.
 *
 * board_instance_id : ID of board instance to delete.
 */
snog.deleteBoardInstanceMessage = function (boardInstanceID) {
    var msg = { 
        message_type : "delete_board_instance",
        board_instance_id : boardInstanceID
    };
    return msg;
}

/** Drops an item instance from the bag.
 *
 * bag_id : ID of bag from which to drop the item.
 * slot_id : Slot ID in the bag.
 * item_instance_uuid : Item instance UUID to drop.
 */
snog.dropItemInstanceMessage = function (bagID, slotID, itemInstanceUuid) {
    var msg = { 
        message_type : "drop_item_instance",
        bag_id : bagID,
        slot_id : slotID,
        item_instance_uuid : itemInstanceUuid
    };
    return msg;
}

/** Find players who are Facebook friends. Request will be immediately acknowledged (ack_type=wilco) and response of type players_found will be delivered asynchronously on the notification channel.
 *
 * realm : Defines the realm (like Facebook Connect).
 * access_token : Valid Facebook user's access token (if using Facebook Connect).
 */
snog.findExternalFriendsMessage = function (realm, accessToken) {
    var msg = { 
        message_type : "find_external_friends",
        realm : realm,
        access_token : accessToken
    };
    return msg;
}

/** Find players based on space separated search terms. Request will be immediately acknowledged (ack_type=wilco) and response of type players_found will be delivered asynchronously on the notification channel.
 *
 * search_terms : Space separated search terms.
 */
snog.findPlayersMessage = function (searchTerms) {
    var msg = { 
        message_type : "find_players",
        search_terms : searchTerms
    };
    return msg;
}

/** Get the friends list for the specified player .
 *
 * player_id : Must be the player ID of the current player or a friend thereof.
 */
snog.getFriendsListMessage = function (playerID) {
    var msg = { 
        message_type : "get_friends_list",
        player_id : playerID
    };
    return msg;
}

/** Retrieves a batch of item instances, asking the server to reserve them for ttl seconds.
 *
 * size : Item batch size.
 * ttl : Items will be reserved for ttl seconds.
 */
snog.getItemBatchMessage = function (size, ttl) {
    var msg = { 
        message_type : "get_item_batch",
        size : size,
        ttl : ttl
    };
    return msg;
}

/** Retrieve a leaderboard. Note that, if pagination is used, ``page_size+1`` rows are returned for a page as a hint to indicate that there are more pages available.
 *
 * type : Leaderboard type, i.e. ``day``, ``week``, ``month``, ``all_time``, ``board`` or ``boards_aggregate``.
 * board_ref : Board reference is an optional field that must be specified for leadearboard of type: ``board``.
 * board_refs : A list of board references is an optional field that must be specified for leadearboard of type: ``boards_aggregate``.
 * filter : Filter is an optional field to narrow down the results. Supported values are: ``friends``.
 * page : Index of the page of leaderboard rows (optional, must be present if page_size is specified).
 * page_size : Number of leaderboard rows per page (optional, must be present if page is specified).
 */
snog.getLeaderboardMessage = function (type, boardRef, boardRefs, filter, page, pageSize) {
    var msg = { 
        message_type : "get_leaderboard",
        type : type,
        board_ref : boardRef,
        board_refs : boardRefs,
        filter : filter,
        page : page,
        page_size : pageSize
    };
    return msg;
}

/** Retrieves the full player inventory.
 *
 */
snog.getPlayerInventoryMessage = function () {
    var msg = { 
        message_type : "get_player_inventory"
    };
    return msg;
}

/** Retrieves a player specific perference.
 *
 * key : Key to identify the preference.
 */
snog.getPreferenceMessage = function (key) {
    var msg = { 
        message_type : "get_preference",
        key : key
    };
    return msg;
}

/** Invite a new player in the system, using the messaging facility of the realm where the invitee is located.
 *
 * realm : Defines the realm (like Facebook Connect).
 * realm_id : Defines the ID of the invitee in the realm.
 * access_token : Valid Facebook user's access token (if using Facebook Connect).
 */
snog.inviteNewPlayerMessage = function (realm, realmID, accessToken) {
    var msg = { 
        message_type : "invite_new_player",
        realm : realm,
        realm_id : realmID,
        access_token : accessToken
    };
    return msg;
}

/** List all the potentially available rewards.
 *
 */
snog.listAllRewardsMessage = function () {
    var msg = { 
        message_type : "list_all_rewards"
    };
    return msg;
}

/** List board instance slots for the logged in player for the given board type (i.e. "contest").
 *
 * board_type : Reference string identifying the board.
 * player_id : (Optional) List board instance slots of player with this ID (if not supplied current player's ID is used).
 */
snog.listBoardInstanceSlotsMessage = function (boardType, playerID) {
    var msg = { 
        message_type : "list_board_instance_slots",
        board_type : boardType,
        player_id : playerID
    };
    return msg;
}

/** List all boards of the given type.
 *
 * board_type : Board type, i.e. ``contest`` or ``special``.
 * filter : (Optional) Board status filter, i.e. ``active``, ``inactive`` or ``all``. Default is ``active``.
 */
snog.listBoardsByTypeMessage = function (boardType, filter) {
    var msg = { 
        message_type : "list_boards_by_type",
        board_type : boardType,
        filter : filter
    };
    return msg;
}

/** List the contributed items of a player.
 *
 * player_id : List the contributed items of player with this ID.
 */
snog.listContributedItemsMessage = function (playerID) {
    var msg = { 
        message_type : "list_contributed_items",
        player_id : playerID
    };
    return msg;
}

/** List a player's favorites of certain type.
 *
 * player_id : List favorites of player with this ID.
 * type : Type of favorites to list, i.e. ``players``, ``board_instances``.
 */
snog.listFavoritesMessage = function (playerID, type) {
    var msg = { 
        message_type : "list_favorites",
        player_id : playerID,
        type : type
    };
    return msg;
}

/** List milestones for current player.
 *
 */
snog.listMilestonesMessage = function () {
    var msg = { 
        message_type : "list_milestones"
    };
    return msg;
}

/** List all the rewards a player has been granted. Note that, if pagination is used, ``page_size+1`` records are returned for a page as a hint to indicate that there are more pages available.
 *
 * player_id : List reward instances of player with this ID.
 * page : Index of the page of reward instances (optional, must be present if page_size is specified).
 * page_size : Number of reward instances per page (optional, must be present if page is specified).
 */
snog.listRewardInstancesMessage = function (playerID, page, pageSize) {
    var msg = { 
        message_type : "list_reward_instances",
        player_id : playerID,
        page : page,
        page_size : pageSize
    };
    return msg;
}

/** Lock a board instance. Optionally include a comment.
 *
 * board_instance_id : Board instance ID which shall be locked.
 * comment : Comment on board instance (optional parameter).
 */
snog.lockBoardInstanceMessage = function (boardInstanceID, comment) {
    var msg = { 
        message_type : "lock_board_instance",
        board_instance_id : boardInstanceID,
        comment : comment
    };
    return msg;
}

/** Log a user in the system with Snoget's credentials (email and password).
 *
 * email : The user's email address.
 * password : The user's password.
 */
snog.loginMessage = function (email, password) {
    var msg = { 
        message_type : "login",
        email : email,
        password : password
    };
    return msg;
}

/** Log a user in the system with Facebook Connect. If Facebook is used, the scope "email" must have been requested!
 *
 * realm : Defines the realm (like Facebook Connect).
 * access_token : Valid Facebook user's access token (if using Facebook Connect).
 */
snog.loginFacebookConnectMessage = function (realm, accessToken) {
    var msg = { 
        message_type : "login",
        realm : realm,
        access_token : accessToken
    };
    return msg;
}

/** Log a user in the system with Twitter.
 *
 * realm : Defines the realm (like Facebook Connect).
 * oauth_token : Twitter OAuth token (optional, must be present when 'oauth_verifier' is present)
 * oauth_verifier : OAuth verfier (optional, must be present when 'oauth_token' is present).
 */
snog.loginTwitterMessage = function (realm, oauthToken, oauthVerifier) {
    var msg = { 
        message_type : "login",
        realm : realm,
        oauth_token : oauthToken,
        oauth_verifier : oauthVerifier
    };
    return msg;
}

/** Log a user out of the system.
 *
 */
snog.logoutMessage = function () {
    var msg = { 
        message_type : "logout"
    };
    return msg;
}

/** Request a new authentication challenge.
 *
 */
snog.newAuthChallengeMessage = function () {
    var msg = { 
        message_type : "new_auth_challenge"
    };
    return msg;
}

/** Sends a new player-to-player in-game message (mail).
 *
 * type : Has to be ``ML`` for mail.
 * to_player_id : ID of player message to sent to.
 * title : Title of the message
 * body : Body of the message.
 */
snog.newIgmMessage = function (type, toPlayerID, title, body) {
    var msg = { 
        message_type : "new_igm",
        type : type,
        to_player_id : toPlayerID,
        title : title,
        body : body
    };
    return msg;
}

/** Initiates the password forgotten procedure.
 *
 * auth_challenge_id : Authentication challenge id requested from the system.
 * challenge : The external challenge identifier (e.g. from reCaptcha).
 * challenge_response : The user's response to the challenge (optional, depends on challenge type).
 * email : Registered user's email address.
 */
snog.passwordForgottenMessage = function (authChallengeID, challenge, challengeResponse, email) {
    var msg = { 
        message_type : "password_forgotten",
        auth_challenge_id : authChallengeID,
        challenge : challenge,
        challenge_response : challengeResponse,
        email : email
    };
    return msg;
}

/** Pings the system.
 *
 */
snog.pingMessage = function () {
    var msg = { 
        message_type : "ping"
    };
    return msg;
}

/** Propose friendship to another player.
 *
 * to_player_id : Friend request will be sent to the player with this ID.
 */
snog.proposeFriendshipMessage = function (toPlayerID) {
    var msg = { 
        message_type : "propose_friendship",
        to_player_id : toPlayerID
    };
    return msg;
}

/** Re-sends the activation e-mail for the current player.
 *
 */
snog.reSendActivationEmailMessage = function () {
    var msg = { 
        message_type : "re_send_activation_email"
    };
    return msg;
}

/** Reads the current player's biography.
 *
 * player_id : Read biography of player with this ID.
 */
snog.readBiographyMessage = function (playerID) {
    var msg = { 
        message_type : "read_biography",
        player_id : playerID
    };
    return msg;
}

/** Retrieve the metadata for a board instance.
 *
 * board_instance_id : Board instance ID metadata is requested for.
 */
snog.readBoardInstanceMessage = function (boardInstanceID) {
    var msg = { 
        message_type : "read_board_instance",
        board_instance_id : boardInstanceID
    };
    return msg;
}

/** Retrieves a particular board instance and its bag.
 *
 * player_id : Player ID the board instance belongs to.
 * board_instance_id : Requested board instance ID.
 */
snog.readBoardInstanceAndBagMessage = function (playerID, boardInstanceID) {
    var msg = { 
        message_type : "read_board_instance_and_bag",
        player_id : playerID,
        board_instance_id : boardInstanceID
    };
    return msg;
}

/** Retrieve the bag of items attached to a board instance.
 *
 * board_instance_id : Board instance ID bag is requested for.
 */
snog.readBoardInstanceBagMessage = function (boardInstanceID) {
    var msg = { 
        message_type : "read_board_instance_bag",
        board_instance_id : boardInstanceID
    };
    return msg;
}

/** Views item metadata.
 *
 * item_ref : Reference to the requested item.
 */
snog.readItemMessage = function (itemRef) {
    var msg = { 
        message_type : "read_item",
        item_ref : itemRef
    };
    return msg;
}

/** Views a particular item instance.
 *
 * item_instance_uuid : Read item instance with this UUID.
 */
snog.readItemInstanceMessage = function (itemInstanceUuid) {
    var msg = { 
        message_type : "read_item_instance",
        item_instance_uuid : itemInstanceUuid
    };
    return msg;
}

/** Read specific milestone for current player.
 *
 * milestone_ref : Milestone Reference
 */
snog.readMilestoneMessage = function (milestoneRef) {
    var msg = { 
        message_type : "read_milestone",
        milestone_ref : milestoneRef
    };
    return msg;
}

/** View a player profile.
 *
 * player_id : Retrieve profile of player with this player_id.
 */
snog.readProfileMessage = function (playerID) {
    var msg = { 
        message_type : "read_profile",
        player_id : playerID
    };
    return msg;
}

/** Reads a particular reward instance
 *
 * reward_instance_id : Reward instance ID to read.
 */
snog.readRewardInstanceMessage = function (rewardInstanceID) {
    var msg = { 
        message_type : "read_reward_instance",
        reward_instance_id : rewardInstanceID
    };
    return msg;
}

/** Reads the current player's status message.
 *
 * player_id : Read status message of player with this ID.
 */
snog.readStatusMessageMessage = function (playerID) {
    var msg = { 
        message_type : "read_status_message",
        player_id : playerID
    };
    return msg;
}

/** Reads a particular reward
 *
 * reward_ref : Reward reference to be read
 */
snog.readRewardMessage = function (rewardRef) {
    var msg = { 
        message_type : "read_reward",
        reward_ref : rewardRef
    };
    return msg;
}

/** Redeem code with key.
 *
 */
snog.redeemCodeMessage = function () {
    var msg = { 
        message_type : "redeem_code"
    };
    return msg;
}

/** Remove a favorite of a certain type.
 *
 * type : Type of favorite to remove, i.e. ``players``, ``board_instances``.
 * id : ID of favorite to remove.
 */
snog.removeFavoriteMessage = function (type, id) {
    var msg = { 
        message_type : "remove_favorite",
        type : type,
        id : id
    };
    return msg;
}

/** Return a batch of item instances (call only after there is no chance that the player can still take an item from the batch).
 *
 * batch_uuid : UUID of batch to return.
 */
snog.returnItemBatchMessage = function (batchUuid) {
    var msg = { 
        message_type : "return_item_batch",
        batch_uuid : batchUuid
    };
    return msg;
}

/** Sets a player specific preference.
 *
 * key : Key to identify the preference.
 * visibility : Visibility for preference. Use ``visibility`` for privacy preferences, i.e. ``all`` for public, ``friends`` for friends only, or ``self`` for private.
 * value : Optional - Value for the preference.
 */
snog.setPreferenceMessage = function (key, visibility, value) {
    var msg = { 
        message_type : "set_preference",
        key : key,
        visibility : visibility,
        value : value
    };
    return msg;
}

/** Signs-up and authenticates a new player.
 *
 * auth_challenge_id : Authentication challenge id requested from the system.
 * challenge : The external challenge identifier (e.g. from reCaptcha).
 * challenge_response : The user's response to the challenge (optional, depends on challenge type).
 * email : The user's email address.
 * password : The user chosen password.
 * first_name : User's first name.
 * last_name : User's last name.
 */
snog.signupAndLoginMessage = function (authChallengeID, challenge, challengeResponse, email, password, firstName, lastName) {
    var msg = { 
        message_type : "signup_and_login",
        auth_challenge_id : authChallengeID,
        challenge : challenge,
        challenge_response : challengeResponse,
        email : email,
        password : password,
        first_name : firstName,
        last_name : lastName
    };
    return msg;
}

/** Swaps slots in the given bags (use undefined for an empty slot).
 *
 * from_bag_id : Bag ID containing item instance to swap from.
 * from_slot_id : Position in bag item instance in ``from_item_instance_uuid`` is at.
 * from_item_instance_uuid : UUID of item instance to swap.
 * to_bag_id : Bag ID item instance in ``from_item_instance_uuid`` to swap to.
 * to_slot_id : Position in bag item instance in ``from_item_instance_uuid`` to swap to.
 * to_item_instance_uuid : ID of item instance item instance in ``from_item_instance_uuid`` to swap with.
 */
snog.swapItemInstancesMessage = function (fromBagID, fromSlotID, fromItemInstanceUuid, toBagID, toSlotID, toItemInstanceUuid) {
    var msg = { 
        message_type : "swap_item_instances",
        from_bag_id : fromBagID,
        from_slot_id : fromSlotID,
        from_item_instance_uuid : fromItemInstanceUuid,
        to_bag_id : toBagID,
        to_slot_id : toSlotID,
        to_item_instance_uuid : toItemInstanceUuid
    };
    return msg;
}

/** Attempts to take an item instance from the specified batch.
 *
 * batch_uuid : UUID of batch item should be taken from.
 * item_instance_uuid : Instance UUID of the item.
 */
snog.takeItemInstanceFromBatchMessage = function (batchUuid, itemInstanceUuid) {
    var msg = { 
        message_type : "take_item_instance_from_batch",
        batch_uuid : batchUuid,
        item_instance_uuid : itemInstanceUuid
    };
    return msg;
}

/** Unlock a board instance.
 *
 * board_instance_id : Board instance ID which shall be unlocked.
 */
snog.unlockBoardInstanceMessage = function (boardInstanceID) {
    var msg = { 
        message_type : "unlock_board_instance",
        board_instance_id : boardInstanceID
    };
    return msg;
}

/** Update the current player's biography.
 *
 * content : The new biography.
 * visibility : Visibility of the biography, i.e. ``all`` for public, ``friends`` for friends only, or ``self`` for private.
 */
snog.updateBiographyMessage = function (content, visibility) {
    var msg = { 
        message_type : "update_biography",
        content : content,
        visibility : visibility
    };
    return msg;
}

/** Update a player profile.
 *
 * player_id : Update player with this ID.
 * first_name : The player's first name.
 * last_name : The player's last name.
 * privacy : Indicated if the player wants his name publicly fully displayed or not.
 * gender : Player's gender, e.g. ``F`` or ``M`` (String of fixed length 1).
 * city : City where the player lives.
 * country_code : Country the player is from, e.g. ``US``, ``CA``, ``DE``, etc. (String of fixed length 2).
 * birth_year : Player's birth year.
 * birth_month : Player's birth month.
 * birth_day : Player's birth day.
 */
snog.updateProfileMessage = function (playerID, firstName, lastName, privacy, gender, city, countryCode, birthYear, birthMonth, birthDay) {
    var msg = { 
        message_type : "update_profile",
        player_id : playerID,
        first_name : firstName,
        last_name : lastName,
        privacy : privacy,
        gender : gender,
        city : city,
        country_code : countryCode,
        birth_year : birthYear,
        birth_month : birthMonth,
        birth_day : birthDay
    };
    return msg;
}

/** Update a player profile's avatar.
 *
 * avatar_uri : URI to new avatar image.
 */
snog.updateProfileAvatarMessage = function (avatarUri) {
    var msg = { 
        message_type : "update_profile_avatar",
        avatar_uri : avatarUri
    };
    return msg;
}

/** Update the current player's status message.
 *
 * message : The new status message.
 * visibility : Visibility of the status message, i.e. ``all`` for public, ``friends`` for friends only, or ``self`` for private.
 */
snog.updateStatusMessageMessage = function (message, visibility) {
    var msg = { 
        message_type : "update_status_message",
        message : message,
        visibility : visibility
    };
    return msg;
}/**
 * Extend events by two additional statuses;
 * @type {string}
 */
Snog.events.RECAPCHA_READY = "RECAPCHA_READY";
Snog.events.RECAPCHA_ERROR = "RECAPCHA_ERROR";

/**
 * This module provides implementation of the google recaptcha.
 *
 * This module is not included by default and initialized only when
 * Snog.events.NEW_AUTH_CHALLENGE event is sent and we got a server
 * response.
 *
 * Response will have property 'type' that is equals to this module
 * name ( recaptcha ). Type is configured on the server side.
 *
 * @see snog_callbacks::auth_challenge_callback
 *
 * For more information about recaptcha itself, see
 * http://www.google.com/recaptcha
 */
Snog.define("recaptcha", function (require, exports, module) {
    "use strict";

    var snog_dispatcher = Snog.require('dispatcher');

    // Load recaptcha script;
    jQuery.getScript("//www.google.com/recaptcha/api/js/recaptcha_ajax.js")
        .done(function (script, textStatus) {
                  if (textStatus === 'success') {
                      snog_dispatcher.b(Snog.events.RECAPCHA_READY);
                  } else {
                      snog_dispatcher.b(Snog.events.RECAPCHA_ERROR);
                  }
              })
        .fail(function (jqxhr, settings, exception) {
                  snog_dispatcher.b(Snog.events.RECAPCHA_ERROR);
              });


    exports.auth_challenge_id = null;   // unique snog provided auth challenge id
    exports.auth_challenge_pk = null;   // unique snog provided public key for the recaptcha
    exports.theme = "white";            // default color scheme

    /**
     * Show recaptcha at target element;
     *
     * @param element
     */
    exports.show = function (element) {
        if (this.auth_challenge_pk === null) {
            throw new Error('reCaptcha public key is null');
        }

        Recaptcha.create(this.auth_challenge_pk, element, {
            theme: this.theme,
            callback: Recaptcha.focus_response_field});
    };

    /**
     * Returns unique auth challenge id set by
     *
     * @returns {String}
     */
    exports.getAuthChallenge = function () {
        return this.auth_challenge_id;
    };

    /**
     * Returns google recaptcha challenge
     * @returns {String}
     */
    exports.getChallenge = function() {
        return Recaptcha.get_challenge();
    };

    /**
     * Returns user typed response
     * @returns {String}
     */
    exports.getResponse = function () {
        return Recaptcha.get_response();
    };

    /**
     * Force to reload recaptcha
     */
    exports.reload = function() {
        Recaptcha.reload();
    }
});
