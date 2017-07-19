$(function () {
    /**
     * Widget module is an example view implementation;
     */
    Snog.define("widget", function (require, exports, module) {
        "use strict";

        var snog_dispatcher = require("dispatcher");
        var snog_data = require("data");

        module.exports = {

            target : "body", // default target where to render object;
            prepend: false,  // if true prepend element into parent;

            /**
             * Login widget, representation of login screen;
             */
            login: {

                //--------------------------------------------------------------------------------------------
                // Render functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Display login widget using login.tpl file.
                 * All data is populated from the context object;
                 *
                 * @param target {object || string }
                 * @param prepend {boolean}
                 */
                displayLogin: function (target, prepend) {

                    // render div that contains login;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;

                    var div = $("<div class='snog_panel' id='login'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Login</span><br>").appendTo(div);
                    $("<span>Email:</span><input placeHolder='name@domain.com' type='email' id='email_input'/>").appendTo(div);
                    $("<span>Password: </span><input type='password' placeholder='password' id='password_input'/>").appendTo(div);
                    $("<input class='button' type='button' value='Login' id='login_button' />").appendTo(div);

                    // "Login" button click callback;
                    var self = this;
                    $("#login_button").click(function () {
                        self.onLoginButtonClick();
                    });
                },

                /**
                 * Display pure FB login widget;
                 * @param target
                 * @param prepend
                 */
                displayPureFBLogin: function (target, prepend) {

                    // render div that contains login;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;

                    var div = $("<div class='snog_panel' id='login'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Facebook Login</span><br>").appendTo(div);
                    $("<input class='button' type='button' value='Login with FB' id='fb_login_button' />").appendTo(div);

                    // "Login with FB" button click callback;
                    var self = this;
                    $("#fb_login_button").click(function () {
                        this.onFacebookLoginButtonClick();
                    });
                },

                /**
                 * Display pure Realm login widget;
                 * @param target
                 * @param prepend
                 */
                displayPureRealmLogin: function (target, prepend) {

                    // render div that contains login;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;

                    var div = $("<div class='snog_panel' id='login'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Realm Login</span><br>").appendTo(div);
                    $("<span>Token:</span><input placeHolder='your secret token' type='text' id='token_input'/>").appendTo(div);
                    $("<input class='button' type='button' value='Login with Realm' id='realm_login_button' />").appendTo(div);

                    // "Login with FB" button click callback;
                    var self = this;
                    $("#realm_login_button").click(function () {
                        self.onRealmLoginButtonClick();
                    });
                },

                /**
                 * Display login with FB widget;
                 * @param target
                 * @param prepend
                 */
                displayLoginWithFacebook: function (target, prepend) {
                    this.displayLogin();

                    // render div that contains login;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("#login");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<input class='button' type='button' value='Login with FB' id='fb_login_button' />").appendTo(div);

                    // "Login with FB" button click callback;
                    var self = this;
                    $("#fb_login_button").click(function () {
                        self.onFacebookLoginButtonClick();
                    });
                },

                /**
                 * Display login with FB widget;
                 * @param target
                 * @param prepend
                 */
                displayLoginWithTwitter: function (target, prepend) {
                    this.displayLogin();

                    // render div that contains login;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("#login");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<input class='button' type='button' value='Twitter Login' id='tw_login_button' />").appendTo(div);

                    // "Login with FB" button click callback;
                    var self = this;
                    $("#tw_login_button").click(function () {
                        self.onTwitterLoginButtonClick();
                    });
                },

                //--------------------------------------------------------------------------------------------
                // General functions
                //--------------------------------------------------------------------------------------------

                /**
                 * Block input and buttons;
                 * @param arg
                 */
                block: function (arg) {
                    $("#login input").attr("disabled", arg);
                },

                /**
                 * Destroy login widget
                 */
                destroy: function () {
                    $("#login").remove();
                },

                /**
                 * Get input email
                 * @return {*}
                 */
                getEmail: function () {
                    return $("#email_input").val();
                },

                /**
                 * Get input password
                 * @return {*}
                 */
                getPassword: function () {
                    return $("#password_input").val();
                },

                getToken: function () {
                    return $("#token_input").val();
                },

                //--------------------------------------------------------------------------------------------
                // Click handlers
                //--------------------------------------------------------------------------------------------

                /**
                 * "Login" button click callback
                 */
                onLoginButtonClick: function () {
                    this.block(true);
                    snog_dispatcher.broadcast(Snog.events.LOGIN, {email: this.getEmail(), password: this.getPassword() });
                },

                /**
                 * "Login with FB" click callback;
                 */
                onFacebookLoginButtonClick: function () {
                    this.block(true);
                    snog_dispatcher.broadcast(Snog.events.FACEBOOK_LOGIN);
                },

                onRealmLoginButtonClick: function () {
                    this.block(true);
                    snog_dispatcher.broadcast(Snog.events.REALM_LOGIN, {token: this.getToken() });
                },

                onTwitterLoginButtonClick: function () {
                    this.block(true);
                    snog_dispatcher.broadcast(Snog.events.TWITTER_LOGIN);
                }
            },

            /**
             * Logout widget, representation of logout screen
             */
            logout: {
                //--------------------------------------------------------------------------------------------
                // Render functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Display logout widget;
                 * @param target
                 * @param prepend
                 */
                displayLogout: function (target, prepend) {

                    // render div that contains login;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("<div class='snog_panel' id='logout'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Logout</span><br>").appendTo(div);
                    $("<input class='button' type='button' value='Logout' id='logout_button' />").appendTo(div);

                    // "Logout" button click callback;
                    var self = this;
                    $("#logout_button").click(function () {
                        self.onLogoutButtonClick();
                    });
                },

                //--------------------------------------------------------------------------------------------
                // General functions
                //--------------------------------------------------------------------------------------------

                /**
                 * Destroy logout widget;
                 */
                destroy: function () {
                    $("#logout").remove();
                },

                //--------------------------------------------------------------------------------------------
                // Button click callbacks
                //--------------------------------------------------------------------------------------------

                /**
                 * "Logout" button click callback;
                 */
                onLogoutButtonClick: function () {
                    snog_dispatcher.broadcast(Snog.events.LOGOUT);
                }
            },

            /**
             * Signup widget, representation of signup screen
             */
            signup: {
                //--------------------------------------------------------------------------------------------
                // Render functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Display signup widget;
                 * @param target
                 * @param prepend
                 */
                displaySignup: function (target, prepend) {

                    // render div that contains login;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("<div class='snog_panel' id='signup'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Signup</span><br>").appendTo(div);
                    $("<br/><span>First Name:</span><br/><input type='text' id='name_input'/>").appendTo(div);
                    $("<br/><span>Last Name:</span><br/><input type='text' id='surname_input'/>").appendTo(div);
                    $("<br/><span>Email:</span><br/><input placeHolder='name@domain.com' type='email' id='email_input'/>").appendTo(div);
                    $("<br/><span>Password: </span><br/><input type='password' id='password_input'/>").appendTo(div);
                    $("<br/><div id='challenge_div'></div>").appendTo(div);
                    $("<br/><input class='button' type='button' value='Signup' id='signup_button' />").appendTo(div);

                    // "Signup" button click callback
                    var self = this;
                    $("#signup_button").click(function () {
                        self.onSignupButtonClick();
                    });
                },

                /**
                 * Refresh captcha
                 * @param element
                 */
                displayChallenge: function (element) {
                    var auth_module = Snog.require(snog_data.auth_type);
                    auth_module.show('challenge_div');
                },

                //--------------------------------------------------------------------------------------------
                // General functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Block input and buttons;
                 * @param arg
                 */
                block: function (arg) {
                    $("#signup > input").attr("disabled", arg);
                },

                /**
                 * Destroy signup widget;
                 */
                destroy: function () {
                    $("#signup").remove();
                },

                /**
                 * Get email input;
                 * @return {*}
                 */
                getEmail: function () {
                    return $("#email_input").val();
                },

                /**
                 * Get password input;
                 * @return {*}
                 */
                getPassword: function () {
                    return $("#password_input").val();
                },

                /**
                 * Get challenge;
                 * @return {String}
                 */
                getChallenge: function () {
                    var auth_module = Snog.require(snog_data.auth_type);
                    return auth_module.getChallenge();
                },

                /**
                 * Get auth challenge;
                 * @return {String}
                 */
                getAuthChallenge: function () {
                    var auth_module = Snog.require(snog_data.auth_type);
                    return auth_module.getAuthChallenge();
                },

                /**
                 * Get response input;
                 * @return {String}
                 */
                getResponse: function () {
                    var auth_module = Snog.require(snog_data.auth_type);
                    return auth_module.getResponse();
                },

                /**
                 * Get first name input;
                 * @return {*}
                 */
                getFirstName: function () {
                    return $("#name_input").val();
                },

                /**
                 * Get last name input;
                 * @return {*}
                 */
                getLastName: function () {
                    return $("#surname_input").val();
                },

                //--------------------------------------------------------------------------------------------
                // Button click callbacks;
                //--------------------------------------------------------------------------------------------

                /**
                 * "Signup" button click callback;
                 */
                onSignupButtonClick: function () {
                    var request = {};
                    request.auth_challenge_id = this.getAuthChallenge();
                    request.challenge = this.getChallenge();
                    request.challenge_response = this.getResponse();
                    request.email = this.getEmail();
                    request.password = this.getPassword();
                    request.first_name = this.getFirstName();
                    request.last_name = this.getLastName();

                    snog_dispatcher.broadcast(Snog.events.SIGN_UP, request);
                },

                /**
                 * "Captcha" img click callback;
                 */
                onCaptchaImgClick: function () {
                    snog_dispatcher.broadcast(Snog.events.NEW_AUTH_CHALLENGE_REQUEST);
                }
            },

            /**
             * Inventory widget, representation of player's inventory screen;
             */
            inventory: {
                DROP_BUTTON: 1,
                SWAP_BUTTON: 2,

                button_flags: 0,

                //--------------------------------------------------------------------------------------------
                // Render functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Display inventory widget;
                 * @param target
                 * @param prepend
                 */
                displayInventory: function (target, prepend) {

                    // render div that contains inventory;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("<div class='snog_panel' id='inventory'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Inventory</span><br>").appendTo(div);
                    $("<div class='snog_container'></div>").appendTo(div);
                },

                /**
                 * Refresh inventory items;
                 * @param bag
                 */
                refreshInventory: function (bag) {
                    // destroy old inventory;
                    $('#inventory > .snog_container').children().remove();

                    // render inventory bag item instances;
                    var i, self = this;
                    for (i = 0; i < bag.slots.length; i += 1) {
                        var slot = bag.slots[i];
                        var div = $('<div class="snog_item" id="inventory_item" data-slot-id="' + i +'" slot_id="' + i + '" ></div>');

                        if (slot !== null && slot.item_instance !== null) {
                            // render image image;

                            if (slot.item_instance !== null && slot.item_instance.assets !== null && slot.item_instance.assets.length > 0) {
                                div.append("<img src='" + slot.item_instance.assets[0].uri + "' />");
                            } else {
                                div.append("<img src='' />");
                            }

                            div.click( function() {
                               self.onItemClick($(this));
                            });

                            // "Drop" button click callback;
                            var btn;
                            if (this.DROP_BUTTON & this.button_flags) {
                                btn = $('<input type="button" value="Drop" />');
                                btn.click(function () {
                                    self.onDropButtonClick($(this));
                                });
                                div.append(btn);
                            }

                            // "Swap" button click callback;
                            if (this.SWAP_BUTTON & this.button_flags) {
                                btn = $('<input type="button" value="Swap" />');
                                btn.click(function () {
                                    self.onSwapButtonClick($(this));
                                });
                                div.append(btn);
                            }
                        }

                        $('#inventory > .snog_container').append(div);
                    }
                },

                //--------------------------------------------------------------------------------------------
                // General functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Destroy inventory widget
                 */
                destroy: function () {
                    $("#inventory").remove();
                },

                /**
                 * Set button flags
                 * @param flags
                 */
                setButtonFlags: function (flags) {
                    this.button_flags = flags;
                },

                //--------------------------------------------------------------------------------------------
                // Button click callbacks;
                //--------------------------------------------------------------------------------------------

                /**
                 * "Drop" button click callback;
                 * @param target
                 */
                onDropButtonClick: function (target) {
                    target.attr("disabled", true);

                    // send event to add item to the inventory;
                    snog_dispatcher.broadcast(Snog.events.DROP_INVENTORY_ITEM, {slot_id: target.parent().attr('slot_id')});
                },

                /**
                 * "Swap" button click callback;
                 * @param target
                 */
                onSwapButtonClick: function (target) {

                    var slot = snog_data.player_inventory.getSlotByID(target.parent().attr("slot_id"));
                    var boards = snog_data.boards.getPlayerBoards(snog_data.getPlayerID());
                    var board_instances = boards.getBoardInstancesByBoardRef(require("widget").board.getCurrentBoardRef());
                    var board_instance_bag = null;
                    if (board_instances !== null && board_instances.length > 0) {
                        // use 1st board instance bag;
                        board_instance_bag = boards.getBagByID(board_instances[0].board_instance.bag_id);
                    } else {
                        Snog.log("There is no board instances for the selected board");
                        return;
                    }

                    // check if bag is full;
                    if (board_instance_bag.isFull) {
                        Snog.log("Board bag is full");
                        return;
                    }

                    var request = {};
                    request.from_bag_id = snog_data.player_inventory.bag_id;
                    request.from_slot_id = slot.slot_id;
                    request.from_item_instance_uuid = slot.item_instance.item_instance_uuid;

                    request.to_bag_id = board_instance_bag.bag_id;
                    request.to_slot_id = board_instance_bag.getEmptySlot().slot_id;
                    request.to_item_instance_uuid = null;

                    snog_dispatcher.broadcast(Snog.events.SWAP_ITEM_INSTANCES, request);
                },

                onItemClick: function( target ) {
                }
            },

            /**
             * Batch widget, representation of items batch screen;
             */
            batch: {
                TAKE_BUTTON : 1,
                button_flags: 0,

                //--------------------------------------------------------------------------------------------
                // Render functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Display batch widget;
                 * @param target
                 * @param prepend
                 */
                displayBatch: function (target, prepend) {
                    // render div that contains batch;

                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("<div class='snog_panel' id='batch'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Batch</span><br>").appendTo(div);
                    $("<input type='button' disabled='true' class='button' id='reload_batch_button' value='Reload'/>").appendTo(div);
                    $("<div class='snog_container'></div>").appendTo(div);

                    // "Reload" button click callback;
                    var self = this;
                    $("#reload_batch_button").click(function () {
                        self.onBatchReloadButtonClick();
                    });
                },

                /**
                 * Refresh batch items;
                 * @param batch
                 */
                refreshBatch: function (batch) {
                    this.block(false);

                    // destroy old batch;
                    $('#batch > .snog_container').children().remove();
                    $('#batch > .snog_container').attr("batch_uuid", batch.batch_uuid);

                    // render item instances;
                    var i, self = this;
                    for (i = 0; i < batch.item_instances.length; i += 1) {
                        var item_instance = batch.item_instances[i];
                        var div = $('<div class="snog_item" id="batch_item" index="' + i + '"></div>');
                        if (item_instance !== null) {

                            // render image;
                            if (item_instance.assets !== null && item_instance.assets.length > 0) {
                                div.append('<img src="' + item_instance.assets[0].uri + '" />');
                            } else {
                                div.append('<img src="" />');
                            }

                            // "Take" button click callback;
                            var btn;
                            if (this.TAKE_BUTTON & this.button_flags) {
                                btn = $('<input type="button" value="Take" />');
                                btn.click(function () {
                                    self.onItemTakeButtonClick($(this));
                                });
                                div.append(btn);
                            }
                        }
                        $('#batch > .snog_container').append(div);
                    }
                },

                //--------------------------------------------------------------------------------------------
                // General functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Block all inputs;
                 * @param arg
                 */
                block: function (arg) {
                    $('#batch > input').attr("disabled", arg);
                },

                /**
                 * Destroy batch widget;
                 */
                destroy: function () {
                    $("#batch").remove();
                },

                /**
                 * Set button flags
                 * @param flags
                 */
                setButtonFlags: function (flags) {
                    this.button_flags = flags;
                },

                //--------------------------------------------------------------------------------------------
                // Button click callbacks;
                //--------------------------------------------------------------------------------------------

                /**
                 * "Reload batch" click callback;
                 */
                onBatchReloadButtonClick: function () {
                    this.block(true);
                    snog_dispatcher.broadcast(Snog.events.GET_ITEM_BATCH, { size: 24, ttl: 240 });
                },

                /**
                 * "Take" button click callback;
                 * @param target
                 */
                onItemTakeButtonClick: function (target) {
                    target.attr("disabled", true);

                    var batch = snog_data.batches.getBatchByUUID($('#batch > .snog_container').attr("batch_uuid"));
                    var item = batch.getItemAtIndex(target.parent().attr("index"));

                    // send event to take an item from the batch;
                    snog_dispatcher.broadcast(Snog.events.TAKE_ITEM_FROM_BATCH, {item_instance_uuid: item.item_instance_uuid, batch_uuid: batch.batch_uuid});
                }
            },

            /**
             * Board widget, representation of the user's board screen
             */
            board: {
                DROP_BUTTON                 : 1,
                SWAP_BUTTON                 : 2,
                DELETE_BOARD_INSTANCE_BUTTON: 4,
                LOCK_BOARD_INSTANCE_BUTTON           : 8,

                button_flags    : 0,
                hasCompatibility: false,

                //--------------------------------------------------------------------------------------------
                // Render functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Display board widget;
                 * @param target
                 * @param prepend
                 */
                displayBoard: function (target, prepend) {

                    // render div that contains board;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("<div class='snog_panel' id='board'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Board</span><br>").appendTo(div);
                    $("<span class='snog_title' >Selected board:</span>").appendTo(div);
                    $("<select><option value='null'></option></select>").appendTo(div);
                    $("<input type='button' class='button' id='create_board_instance_button' value='Create board instance' disabled='true'/>").appendTo(div);
                    $("<input type='button' class='button' id='delete_board_instance_button' value='Drop board instance' disabled='true'/>").appendTo(div);
                    $("<div class='snog_container'></div>").appendTo(div);

                    // "Create board instance" button click callback;
                    var self = this;
                    $("#create_board_instance_button").click(function () {
                        self.onCreateInstanceButtonClick();
                    });

                    $("#delete_board_instance_button").click(function () {
                        self.onDeleteInstanceButtonClick();
                    });

                    // setup dropbox change listener;
                    $('#board > select').change(function () {
                        $("#board > select option:selected").each(function () {
                            self.refreshBoard($(this).val());
                        });
                    });
                },

                /**
                 * Refresh boards list;
                 * @param boards
                 */
                refreshBoardList: function (boards) {
                    // Create list of the boards;
                    var i;
                    for (i = 0; i < boards.length; i += 1) {
                        var board = boards[i];
                        $("#board > select").append("<option value='" + board.board_ref + "'>" + board.title + "</option>");
                    }
                },

                /**
                 * Refresh board;
                 * @param board_ref
                 */
                refreshBoard: function (board_ref) {

                    // destroy old board;
                    var container = $("#board > .snog_container");
                    container.children().remove();
                    container.attr("board_ref", board_ref);

                    // destroy old compatibility results;
                    if (this.hasCompatibility) {
                        $("#compatibility > .snog_container").children().remove();
                    }

                    var boards = snog_data.boards.getPlayerBoards(snog_data.getPlayerID());
                    var board = boards.getBoardByRef(board_ref);
                    if (board !== null) {

                        // display board description;
                        container.append("<span><b>Description:</b> " + board.description + "</span><br><br>");

                        // Each board may have more than 1 board instance;
                        var instances = boards.getBoardInstancesByBoardRef(board_ref), i, self = this;
                        for (i = 0; i < instances.length; i += 1) {
                            var board_instance = instances[i].board_instance;
                            if (board_instance !== null) {

                                // display board instance div;
                                var div = $("<div board_instance_id='" + board_instance.board_instance_id + "'></div>");

                                var btn;
                                if (this.button_flags & this.DELETE_BOARD_INSTANCE_BUTTON) {
                                    btn = $("<input type='button' id='board_delete_instance_button' value='Delete board instance' />");
                                    btn.click(function () {
                                        self.onDeleteInstanceButtonClick($(this));
                                    });
                                    div.append(btn);
                                }

                                if (this.button_flags & this.LOCK_BOARD_INSTANCE_BUTTON) {
                                    btn =$("<input type='button' id='board_lock_instance_button' value='Lock/Unlock board instance' />")
                                    btn.click(function () {
                                        self.onLockUnlockInstanceButtonClick($(this));
                                    });
                                    div.append(btn);
                                }

                                if (this.hasCompatibility) {
                                    btn = $("<input type='button' class='button' id='calculate_button' value='Calculate compatibility' />").appendTo(div);

                                    // setup compatibility button click handler;
                                    btn.click(function () {
                                        self.onCompatibilityButtonClick($(this));
                                    });
                                }

                                var board_slot = boards.getBoardInstanceSlotByID( board_instance.board_instance_id );
                                $("<span><b>Instance:</b> " + board_instance.title + " ["+ (board_slot.locked?"Locked":"Unlocked") + "]</span>").appendTo(div);
                                $("<div class='snog_container' id='board_instance_bag'></div>").appendTo(div);

                                container.append(div);

                                // check if board bag is loaded;
                                var bag = boards.getBagByID(board.bag_id);
                                if (bag === null) {

                                    // load bag from the server;
                                    snog_dispatcher.broadcast(Snog.events.LOAD_BOARD_INSTANCE_BAG, {board_instance_id: board_instance.board_instance_id});
                                } else {

                                    // refresh board instance bag;
                                    this.refreshBoardInstanceBag(board.board_instance_id, bag);
                                }
                            }
                        }

                        // enable "create board instance" button
                        $("#create_board_instance_button").attr("disabled", false);
                        $("#delete_board_instance_button").attr("disabled", false);
                        $("#calculate_button").attr("disabled", false);
                    } else {
                        // board = null;
                        // disable "create board instance" button
                        $("#create_board_instance_button").attr("disabled", true);
                        $("#delete_board_instance_button").attr("disabled", true);
                        $("#calculate_button").attr("disabled", true);
                    }
                },

                /**
                 * Refresh board instance bag;
                 * @param board_instance_id
                 * @param bag
                 */
                refreshBoardInstanceBag: function (board_instance_id, bag) {

                    // get a container for the board instance;
                    var container = $('#board > .snog_container > div[board_instance_id="' + board_instance_id + '"] > .snog_container');

                    // destroy old bag;
                    container.children().remove();
                    container.attr("bag_id", bag.bag_id);

                    // render items;
                    if (bag.slots !== null) {
                        var i, self = this;
                        for (i = 0; i < bag.size; i += 1) {
                            var slot = bag.slots[i];
                            var div = $('<div class="snog_item" id="board_item" slot_id="' + slot.slot_id + '"  ></div>');

                            if (slot !== null && slot.item_instance !== null) {

                                // display an item image;
                                // render image;
                                if (slot.item_instance.assets !== null && slot.item_instance.assets.length > 0) {
                                    div.append('<img src="' + slot.item_instance.assets[0].uri + '" width="100%" height="100%" />');
                                } else {
                                    div.append('<img src="" />');
                                }

                                // display drop button;
                                var btn;
                                if (this.button_flags & this.DROP_BUTTON) {
                                    btn = $('<input type="button" value="Drop" >');
                                    btn.click(function () {
                                        $(this).attr('disabled', true);
                                        self.onItemDropButtonClick($(this));
                                    });
                                    container.append(btn);
                                }

                                // display swap button;
                                if (this.button_flags & this.SWAP_BUTTON) {
                                    btn = $('<input type="button" value="Swap" >');
                                    btn.click(function () {
                                        $(this).attr('disabled', true);
                                        self.onItemSwapButtonClick($(this));
                                    });
                                    container.append(btn);
                                }
                            }
                            container.append(div);
                        }
                    }
                },

                /**
                 * Display compatibility results;
                 * @param target
                 * @param prepend
                 */
                displayCompatibility: function (target, prepend) {
                    this.hasCompatibility = true;

                    // render div that contains board;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("<div class='snog_panel' id='compatibility'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Compatibility</span><br>").appendTo(div);
                    $("<span>In order to get compatibility results, please select a board first.</span>").appendTo(div);
                    $("<div class='snog_container'></div>").appendTo(div);
                },

                /**
                 * Refresh compatibility results;
                 * @param data
                 */
                refreshCompatibility: function (data) {
                    // destroy old results;
                    var container = $("#compatibility > .snog_container"), i, j;
                    container.children().remove();

                    // Display results;
                    if (data.matches !== null && data.matches.length > 0) {
                        for (i = 0; i < data.matches.length; i += 1) {
                            var match = data.matches[i];
                            var match_div = $('<div id="compatibility_match" data-player_id="' + match.player_id + '" data-board_instance_id="' + match.board_instance_id + '"></div>');

                            container.append(match_div);

                            // show profile of the player found in the match;
                            var match_profile = snog_data.profiles.getPlayerProfileByID(match.player_id);
                            var match_profile_div = $('<div class="column" id="player_profile"></div>');

                            // create profile div;
                            match_div.append(match_profile_div);

                            if (match_profile.isLoaded) {
                                // display player's avatar;
                                this.refreshProfile(match_profile);
                            } else {
                                // player's profile is not loaded;
                                if (!match_profile.isLoading) {
                                    snog_dispatcher.broadcast(Snog.events.READ_PLAYER_PROFILE, { player_id: match.player_id});
                                }
                            }

                            // create container for the items;
                            var items_container = $("<div  class='snog_container column'></div>");
                            items_container.appendTo(match_div);

                            // create bag with items;
                            for (j = 0; j < match.items.length; j += 1) {
                                var item = match.items[j];
                                var item_div = $('<div class="compatibility_item" data-item_instance_uuid="' + item.item_instance_uuid + '"  ></div>');
                                items_container.append(item_div);

                                // check if player and user have the same item, as we do;
                                if (item.in_common) {
                                    item_div.addClass("common");
                                }

                                // get item from the hash;
                                var item_instance = snog_data.items.getItemInstanceByUUID(item.item_instance_uuid);
                                if (item_instance !== null && item_instance !== undefined) {
                                    // item description is loaded, display an image;
                                    this.refreshItemInstance(item_instance);
                                } else {
                                    // load item by item instance uuid;
                                    snog_dispatcher.broadcast(Snog.events.READ_ITEM_INSTANCE, { item_instance_uuid: item.item_instance_uuid });
                                }
                            }
                        }
                    } else {
                        $("<span class='snog_title'>There are no results found. Please change items on the board and try again.</span>").appendTo(container);
                    }
                },

                /**
                 * User's profile change handler;
                 * @param profile
                 */
                refreshProfile: function (profile) {
                    // search for the div;
                    var div = $('div[data-player_id="' + profile.player_id + '"] > #player_profile');
                    if (div !== null) {
                        div.children().remove();
                        div.append('<img src="' + profile.avatar_uri + '" width="90" height="90" alt="Avatar" /></div>');
                    }
                },

                /**
                 * Item instance change handler;
                 * @param item_instance
                 */
                refreshItemInstance: function (item_instance) {
                    // search for the div;
                    var item_div = $('div[data-item_instance_uuid="' + item_instance.item_instance_uuid + '"]');
                    if (item_div !== null) {
                        item_div.children().remove();

                        if (item_instance.assets !== null && item_instance.assets.length > 0) {
                            item_div.append('<img src="' + item_instance.assets[0].uri + '" width="100%" height="100%" />');
                        } else {
                            item_div.append('<img src="" />');
                        }
                    }
                },

                //--------------------------------------------------------------------------------------------
                // General functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Destroy board div;
                 */
                destroy: function () {
                    $("#board").remove();
                },

                /**
                 * Set button flags
                 * @param flags
                 */
                setButtonFlags: function (flags) {
                    this.button_flags = flags;
                },

                /**
                 * Get current board reference;
                 * @return {*}
                 */
                getCurrentBoardRef: function () {
                    return $("#board > .snog_container").attr("board_ref");
                },

                getBoardInstanceID: function() {
                    return $("#board > .snog_container > div[board_instance_id]").attr("board_instance_id");
                },

                //--------------------------------------------------------------------------------------------
                // Button click callbacks;
                //--------------------------------------------------------------------------------------------

                /**
                 * "Create instance" button click callback;
                 */
                onCreateInstanceButtonClick: function () {
                    snog_dispatcher.broadcast(Snog.events.CREATE_BOARD_INSTANCE, {board_ref: this.getCurrentBoardRef() });
                },

                /**
                 * "Delete instance" button click callback;
                 * @param target
                 */
                onDeleteInstanceButtonClick: function (target) {

                    snog_dispatcher.broadcast(Snog.events.DELETE_BOARD_INSTANCE, {board_instance_id: parseInt( this.getBoardInstanceID(), 10)});
                },

                /**
                 * "Lock or unlock instance" button click callback;
                 * @param target
                 */
                onLockUnlockInstanceButtonClick: function (target) {
                    var board_instance_id = parseInt(target.parent().attr("board_instance_id"), 10);
                    var boards = snog_data.boards.getPlayerBoards( snog_data.getPlayerID() );
                    var board_slot = boards.getBoardSlotByBoardInstanceID( board_instance_id );
                    console.log( board_slot );

                    if ( board_slot.locked ) {
                        snog_dispatcher.b(Snog.events.UNLOCK_BOARD_INSTANCE, { board_instance_id: board_instance_id });
                    } else {
                        snog_dispatcher.b(Snog.events.LOCK_BOARD_INSTANCE, { board_instance_id: board_instance_id });
                    }
                },


                /**
                 * "Drop" button click callback;
                 * @param target
                 */
                onItemDropButtonClick: function (target) {
                    snog_dispatcher.broadcast(Snog.events.DROP_ITEM, { bag_id: target.parent().parent().attr('bag_id'), slot_id: target.parent().attr('slot_id') });
                },

                /**
                 * "Swap" button click callback;
                 * @param target
                 */
                onItemSwapButtonClick: function (target) {
                    // check if player's inventory full;
                    // This is an optional check, server will not allow to add an item if the bag ( inventory ) full;
                    if (snog_data.player_inventory.isFull) {
                        Snog.log("Inventory full");
                        return;
                    }

                    var boards = snog_data.boards.getPlayerBoards(snog_data.getPlayerID());
                    var board_instance_bag = boards.getBagByID(target.parent().parent().attr('bag_id'));
                    var slot = board_instance_bag.getSlotByID(target.parent().attr('slot_id'));

                    // from bag;
                    var request = {};
                    request.from_bag_id = board_instance_bag.bag_id;
                    request.from_slot_id = slot.slot_id;
                    request.from_item_instance_uuid = slot.item_instance.item_instance_uuid;

                    // to bag, in our case target is the inventory;
                    request.to_bag_id = snog_data.player_inventory.bag_id;
                    request.to_slot_id = snog_data.player_inventory.getEmptySlot().slot_id;
                    request.to_item_instance_uuid = null;

                    snog_dispatcher.broadcast(Snog.events.SWAP_ITEM_INSTANCES, request);
                },

                /**
                 *  "Calculate compatibility" button click callback;
                 *  of the 1st board instance;
                 */
                onCompatibilityButtonClick: function (target) {

                    // destroy old results;
                    var container = $("#compatibility > .snog_container");
                    container.children().remove();
                    $("<span class='snog_title'>Loading results from the server.</span>").appendTo(container);

                    // get 1st board instance and calculate its compatibility.
                    snog_dispatcher.broadcast(Snog.events.CALCULATE_COMPATIBILITY, {board_instance_id: parseInt(target.parent().attr("board_instance_id"), 10)});
                }
            },

            /**
             * Rewards widget, representation of rewards screen;
             */
            rewards: {
                //--------------------------------------------------------------------------------------------
                // Render functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Display rewards widget;
                 * @param target
                 * @param prepend
                 */
                displayRewards: function (target, prepend) {

                    // render div that contains rewards;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("<div class='snog_panel' id='rewards'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Rewards</span><br>").appendTo(div);
                    $("<div class='snog_container'></div>").appendTo(div);
                },

                /**
                 * Display reward instances widget;
                 * @param target
                 * @param prepend
                 */
                displayRewardInstances: function (target, prepend) {

                    // render div that contains reward instances;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("<div class='snog_panel' id='reward_instances'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Reward Instances</span><br>").appendTo(div);
                    $("<div class='snog_container'></div>").appendTo(div);
                },

                /**
                 * Refresh reward
                 * @param rewards_array
                 */
                refreshRewards: function (rewards_array) {

                    // destroy old rewards;
                    var container = $("#rewards > .snog_container");
                    container.children().remove();

                    // render rewards;
                    if (rewards_array !== null && rewards_array.length > 0) {
                        var i;
                        for (i = 0; i < rewards_array.length; i += 1) {
                            var reward = rewards_array[i];

                            var div = $("<div class='snog_item' id='rewards_item'></div>").appendTo(container);

                            if (reward.assets !== null && reward.assets.length > 0) {
                                $("<img src='" + reward.assets[0].uri + "' />").appendTo(div);
                            } else {
                                $("<img src='' />").appendTo(div);
                            }

                            $("<span ><b>Title: </b>" + reward.title + "</span><br><span><b>Description: </b>" + reward.full_description + "</span>").appendTo(div);
                        }
                    }
                },

                /**
                 * Refresh rewards instances
                 * @param reward_instances_array
                 */
                refreshRewardInstances: function (reward_instances_array) {

                    // destroy old reward instances;
                    var container = $("#reward_instances > .snog_container");
                    container.children().remove();

                    // render reward instances;
                    if (reward_instances_array !== null && reward_instances_array.length > 0) {
                        var i;
                        for (i = 0; i < reward_instances_array.length; i += 1) {
                            var reward_instance = reward_instances_array[i];

                            var div = $("<div class='snog_item' id='rewards_item'></div>").appendTo(container);
                            if (reward_instance.assets !== null && reward_instance.assets.length > 0) {
                                $("<img src='" + reward_instance.assets[0].uri + "' />").appendTo(div);
                            } else {
                                $("<img src='' />").appendTo(div);
                            }

                            $("<span ><b>Title: </b>" + reward_instance.title + "</span><br><span><b>Description: </b>" + reward_instance.full_description + "</span>").appendTo(div);
                        }
                    }
                },

                //--------------------------------------------------------------------------------------------
                // General functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Destroy rewards widget;
                 */
                destroyRewards: function () {
                    $("#rewards").remove();
                },

                /**
                 *  Destroy reward instances widget;
                 */
                destroyRewardInstances: function () {
                    $("#reward_instances").remove();
                }
            },

            /**
             * Friends widget, representation of friends screen;
             */
            friends: {
                //--------------------------------------------------------------------------------------------
                // Render functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Display friends widget;
                 * @param target
                 * @param prepend
                 */
                displayFriends: function (target, prepend) {

                    // render div that contains friends;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("<div class='snog_panel' id='friends'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Friends</span><br/>").appendTo(div);
                    $("<div class='snog_container'></div>").appendTo(div);
                },

                /**
                 * Refresh friends
                 *  !!! IMPORTANT !!!
                 *      Friends list contains only player_id but not profiles. Load profiles manually here;
                 * @param friends_array
                 */
                refreshFriends: function (friends_array) {

                    // destroy old friends;
                    var container = $("#friends > .snog_container");
                    container.children().remove();

                    // render friends;
                    if (friends_array !== null && friends_array.length > 0) {
                        var i;
                        for (i = 0; i < friends_array.length; i += 1) {
                            var friend = friends_array[i];

                            // render friend div;
                            var div = $('<div class="snog_item" id="friends_item" data-player_id="' + friend.player_id + '"></div>').appendTo(container);

                            // set data;
                            var friend_profile = snog_data.profiles.getPlayerProfileByID(friend.player_id);
                            if (friend_profile.isLoaded) {
                                this.friends.refreshProfile(friend_profile);
                            } else {
                                // request player's profile from the server;
                                if (friend_profile.isLoading) {
                                    return;
                                }

                                snog_dispatcher.broadcast(Snog.events.READ_PLAYER_PROFILE, { player_id: friend.player_id});
                            }
                        }
                    } else {
                        // user has no friends;
                        container.append($("<span class='snog_title'>You have no friends.</span>"));
                    }
                },

                /**
                 * Refresh friend's profile;
                 * @param profile
                 */
                refreshProfile: function (profile) {
                    // search for the friend by player_id
                    var div = $('#friends > .snog_container > div[data-player_id="' + profile.player_id + '"]');
                    if (div !== null) {
                        div.children().remove();
                        div.append($('<div class="column" ><img src="' + profile.avatar_uri + '" width="90" height="90" alt="Avatar" /></div><div class="column"><span>Name: ' + profile.name + '</span></div>'));
                    }
                },

                //--------------------------------------------------------------------------------------------
                // General functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Destroy friends widget;
                 */
                destroy: function () {
                    $("#friends").remove();
                }
            },

            /**
             * Leaders widget, representation of leaders screen;
             */
            leaders: {
                //--------------------------------------------------------------------------------------------
                // Render functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Display leaders widget;
                 * @param target
                 * @param prepend
                 */
                displayLeaders: function (target, prepend) {

                    // render div that contains friends;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("<div class='snog_panel' id='leaders'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Leaders</span><br/>").appendTo(div);
                    // create 4 buttons with different search criteria;
                    $("<input type='button' class='button' id='day_button' value='Day'/>").appendTo(div);
                    $("<input type='button' class='button' id='week_button' value='Week'/>").appendTo(div);
                    $("<input type='button' class='button' id='month_button' value='Month'/>").appendTo(div);
                    $("<input type='button' class='button' id='all_button' value='All Time'/>").appendTo(div);

                    $("<div class='snog_container'></div>").appendTo(div);

                    var self = this;
                    $("#day_button").click(self.onDayButtonClick);
                    $("#week_button").click(self.onWeekButtonClick);
                    $("#month_button").click(self.onMonthButtonClick);
                    $("#all_button").click(self.onAllButtonClick);
                },

                /**
                 * Refresh leaders
                 *  !!! IMPORTANT !!!
                 *     Leaders list contains only player_id but not profiles. Load profiles manually here;
                 * @param leaders_array
                 */
                refreshLeaders: function (leaders_array) {

                    // destroy old leaders;
                    var container = $("#leaders > .snog_container");
                    container.children().remove();

                    // render leaders;
                    if (leaders_array !== null && leaders_array.length > 0) {
                        var i;
                        for (i = 0; i < leaders_array.length; i += 1) {
                            var leader = leaders_array[i];

                            // render friend div;
                            var div = $('<div class="snog_item" id="leader_item" data-player_id="' + leader.player_id + '"><div class="column" style="width: 40px" ><span>' + leader.rank + '.</span></div><div class="column" id="avatar" ></div><div class="column" id="name" ></div><div class="column" style="width: 100px"><span>Points: ' + leader.points + '</span></div></div>').appendTo(container);

                            // set data;
                            var leader_profile = snog_data.profiles.getPlayerProfileByID(leader.player_id);
                            if (leader_profile.isLoaded) {
                                this.refreshProfile(leader_profile);
                            } else {
                                // request player's profile from the server;
                                if (leader_profile.isLoading) {
                                    return;
                                }

                                snog_dispatcher.broadcast(Snog.events.READ_PLAYER_PROFILE, { player_id: leader.player_id});
                            }
                        }
                    } else {
                        // no leaders;
                        container.append($("<span class='snog_title'>There are no leaders.</span>"));
                    }
                },

                /**
                 * Refresh leader's profile;
                 * @param profile
                 */
                refreshProfile: function (profile) {
                    // search for the leader by player_id
                    var div = $('#leaders > .snog_container > div[data-player_id="' + profile.player_id + '"] > #avatar');
                    if (div !== null) {
                        div.children().remove();
                        div.append($('<img src="' + profile.avatar_uri + '" width="90" height="90" alt="Avatar" />'));
                    }

                    // search for the leader by player_id
                    div = $('#leaders > .snog_container > div[data-player_id="' + profile.player_id + '"] > #name');
                    if (div !== null) {
                        div.children().remove();
                        div.append($('<span>Name: ' + profile.name + '</span>'));
                    }
                },

                //--------------------------------------------------------------------------------------------
                // General functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Destroy Leaders widget;
                 */
                destroy: function () {
                    $("#leaders").remove();
                },

                //--------------------------------------------------------------------------------------------
                // Button click handlers;
                //--------------------------------------------------------------------------------------------

                onDayButtonClick: function () {
                    snog_dispatcher.broadcast(Snog.events.GET_LEADERBOARD, {type: "day"});
                },

                onWeekButtonClick: function () {
                    snog_dispatcher.broadcast(Snog.events.GET_LEADERBOARD, {type: "week"});
                },

                onMonthButtonClick: function () {
                    snog_dispatcher.broadcast(Snog.events.GET_LEADERBOARD, {type: "month"});
                },

                onAllButtonClick: function () {
                    snog_dispatcher.broadcast(Snog.events.GET_LEADERBOARD, {type: "all_time"});
                }
            },

            /**
             * Password widget, representation of password screen;
             */
            password: {
                //--------------------------------------------------------------------------------------------
                // Render functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Display password reset widget;
                 * @param target
                 * @param prepend
                 */
                displayPasswordReset: function (target, prepend) {

                    // render div that contains reset password fields;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("<div class='snog_panel' id='password'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Reset password</span><br>").appendTo(div);
                    $("<span>Email:</span><input placeHolder='name@domain.com' type='email' id='email_input'/>").appendTo(div);
                    $("<div id='challenge_div'></div>").appendTo(div);
                    $("<input class='button' type='button' value='Reset' id='reset_button' />").appendTo(div);

                    // setup click function;
                    var self = this;
                    $("#reset_button").click(function () {
                        self.onResetButtonClick();
                    });

                    $("#challenge").click(function () {
                        self.onCaptchaImgClick();
                    });
                },

                /**
                 * Display password change widget;
                 * @param target
                 * @param prepend
                 */
                displayPasswordChange: function (target, prepend) {

                    // render div that contains reset password fields;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("<div class='snog_panel' id='password'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Change password</span><br>").appendTo(div);
                    $("<span>Password: </span><input type='password' id='password_input'/>").appendTo(div);
                    $("<input class='button' type='button' value='Change' id='change_button' />").appendTo(div);

                    // setup click function;
                    var self = this;
                    $("#change_button").click(function () {
                        self.onChangeButtonClick();
                    });
                },

                /**
                 * Refresh captcha
                 * @param element
                 */
                displayChallenge: function (element) {
                    var auth_module = Snog.require(snog_data.auth_type);
                    auth_module.show('challenge_div');
                },

                //--------------------------------------------------------------------------------------------
                // General functions;
                //--------------------------------------------------------------------------------------------

                /**
                 * Block input and buttons;
                 * @param arg
                 */
                block: function (arg) {
                    $("#password > input").attr("disabled", arg);
                },

                /**
                 * Destroy password div;
                 */
                destroy: function () {
                    $("#password").remove();
                },

                /**
                 * Reset all input values;
                 */
                reset: function () {
                    require('widget').reset(['#email_input', '#password_input']);

                    var auth_module = Snog.require(snog_data.auth_type);
                    return auth_module.reload();
                },

                /**
                 * Get email input;
                 * @return {*}
                 */
                getEmail: function () {
                    return $("#email_input").val();
                },

                /**
                 * Get challenge;
                 * @return {String}
                 */
                getChallenge: function () {
                    var auth_module = Snog.require(snog_data.auth_type);
                    return auth_module.getChallenge();
                },

                /**
                 * Get auth challenge;
                 * @return {String}
                 */
                getAuthChallenge: function () {
                    var auth_module = Snog.require(snog_data.auth_type);
                    return auth_module.getAuthChallenge();
                },

                /**
                 * Get response input;
                 * @return {String}
                 */
                getResponse: function () {
                    var auth_module = Snog.require(snog_data.auth_type);
                    return auth_module.getResponse();
                },

                /**
                 * Get password input;
                 * @return {*}
                 */
                getPassword: function () {
                    return $("#password_input").val();
                },

                //--------------------------------------------------------------------------------------------
                // Button click handlers;
                //--------------------------------------------------------------------------------------------

                /**
                 * 'Reset' button click handler;
                 */
                onResetButtonClick: function () {
                    var request = {};
                    request.auth_challenge_id = this.getAuthChallenge();
                    request.challenge = this.getChallenge();
                    request.challenge_response = this.getResponse();
                    request.email = this.getEmail();

                    snog_dispatcher.broadcast(Snog.events.RESET_PASSWORD, request);
                },

                /**
                 * 'Change' button click;
                 */
                onChangeButtonClick: function () {
                    snog_dispatcher.broadcast(Snog.events.CHANGE_PASSWORD, { new_password: this.getPassword() });
                },

                /**
                 * Captcha img click handler;
                 */
                onCaptchaImgClick: function () {
                    this.requestChallenge();
                }
            },

            /**
             * Profile image uploader
             */
            uploader: {

                displayUploader: function (target, prepend) {
                    // render div that contains reset password fields;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("<div class='snog_panel' id='uploader'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    // !!! IMPORTANT !!! <input name="file" type="file" /> name must be = file
                    $("<span class='snog_header'>Uploader</span><br>").appendTo(div);
                    $('<form id="uploader_form" action="' + snog_data.uploader_url + '/upload?authRealm=' + encodeURI(snog_data.uploader_realm) + '&authToken=' + encodeURI(snog_data.auth_token) + '" method="post" enctype="multipart/form-data"><input name="file" type="file" /><input class="button" type="submit" value="Submit"></form>').appendTo(div);

                    $('form').ajaxForm({
                                           success: function (data) {
                                               snog_dispatcher.broadcast(Snog.events.UPDATE_PLAYER_AVATAR, {avatar_uri: data});
                                           },
                                           error  : function (error) {
                                               snog_dispatcher.broadcast(Snog.events.UPDATE_PLAYER_AVATAR_ERROR, {error_context: error.responseText});
                                           }
                                       });
                },

                destroy: function () {
                    $("#uploader").remove();
                }
            },

            /**
             * Profile
             */
            profile: {

                displayProfile: function (target, prepend) {
                    // render div that contains login;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;

                    var div = $("<div class='snog_panel' id='profile'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Profile</span><br>").appendTo(div)
                    var container = $("<div class='snog_container'></div>").appendTo(div);
                    $('<div class="snog_item" data-player_id="' + snog_data.getPlayerID() + '"><div class="column" id="avatar" ></div><div class="column" id="name" ></div>').appendTo(container);

                },

                /**
                 * Refresh leader's profile;
                 * @param profile
                 */
                refreshProfile: function (profile) {
                    // search for the leader by player_id
                    var div = $('#profile > .snog_container > div[data-player_id="' + profile.player_id + '"] > #avatar');
                    if (div !== null) {
                        div.children().remove();
                        div.append($('<img src="' + profile.avatar_uri + '" width="90" height="90" alt="Avatar" />'));
                    }

                    // search for the leader by player_id
                    div = $('#profile > .snog_container > div[data-player_id="' + profile.player_id + '"] > #name');
                    if (div !== null) {
                        div.children().remove();
                        div.append($('<span>Name: ' + profile.name + '</span><br/><span>From: ' + profile.city + ' </span><br/><span>Points: ' + profile.points + '</span>'));
                    }
                },

                destroy: function () {
                    $("#profile").remove();
                }
            },

            profile_edit: {
                displayProfile: function (target, prepend) {
                    // render div that contains login;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;

                    var div = $("<div class='snog_panel' id='profile'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Profile</span><br>").appendTo(div)
                    var container = $("<div class='snog_container'></div>").appendTo(div);
                    $('<div class="snog_item" data-player_id="' + snog_data.getPlayerID() + '"><div class="column" id="profile_avatar" ></div><div class="column" id="profile_data" ></div>').appendTo(container);
                    $("<input class='button' type='button' value='Update' id='update_button' />").appendTo(div);

                    // "Login" button click callback;
                    var self = this;
                    $("#update_button").click(function () {
                        self.onUpdateButtonClick();
                    });
                },

                /**
                 * Refresh leader's profile;
                 * @param profile
                 */
                refreshProfile: function (profile) {
                    this.block(false);

                    // search for the leader by player_id
                    var div = $('#profile > .snog_container > div[data-player_id="' + profile.player_id + '"] > #profile_avatar');
                    if (div !== null) {
                        div.children().remove();
                        div.append($('<img src="' + profile.avatar_uri + '" width="90" height="90" alt="Avatar" />'));
                    }

                    // search for the leader by player_id
                    div = $('#profile > .snog_container > div[data-player_id="' + profile.player_id + '"] > #profile_data');
                    if (div !== null) {
                        div.children().remove();
                        div.append($('<div><span>First Name:</span><input id="firstname_input" type="text" value="' + profile.first_name + '"></div>' +
                                         '<div><span>Last Name: </span><input id="lastname_input" type="text" value="' + profile.last_name + '"></div>' +
                                         '<div><span>Privacy: </span><input id="privacy_input" type="text" value="' + profile.privacy + '"></div>' +
                                         '<div><span>Gender: </span><input id="gender_input" type="text" value="' + profile.gender + '"></div>' +
                                         '<div><span>Country Code: </span><input id="code_input" type="text" value="' + profile.country_code + '"></div>' +
                                         '<div><span>DOB: </span><input id="day_input" type="text" value="' + profile.birth_day + '">' +
                                         '<input id="month_input" type="text" value="' + profile.birth_month + '">' +
                                         '<input id="year_input" type="text" value="' + profile.birth_year + '"></div>' +
                                         '<div><span>City: </span><input id="city_input" type="text" value="' + profile.city + '"></div>'));
                    }
                },

                /**
                 * Block input and buttons;
                 * @param arg
                 */
                block: function (arg) {
                    $("#profile input").attr("disabled", arg);
                },

                destroy: function () {
                    $("#profile").remove();
                },

                //--------------------------------------------------------------------------------------------
                // Click handlers
                //--------------------------------------------------------------------------------------------

                /**
                 * "Login" button click callback
                 */
                onUpdateButtonClick: function () {
                    this.block(true);

                    var obj = {};
                    obj.first_name = $("#firstname_input").val();
                    obj.last_name = $("#lastname_input").val();
                    obj.privacy = $("#privacy_input").val() === "true" ? true : false;

                    var g = $("#gender_input").val();
                    obj.gender = g === "null" ? null : ( g === "F" ? "F" : "M" );

                    obj.country_code = $("#code_input").val();
                    obj.birth_year = parseInt($("#year_input").val(), 10);
                    obj.birth_month = parseInt($("#month_input").val(), 10);
                    obj.birth_day = parseInt($("#day_input").val(), 10);
                    obj.city = $("#city_input").val();

                    snog_dispatcher.broadcast(Snog.events.UPDATE_PLAYER_PROFILE, obj);
                }
            },

            igm: {

                displayIGM: function( target, prepend ) {
                    // render div that contains login;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;

                    var div = $("<div class='snog_panel' id='igm'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>IGM</span><br>").appendTo(div);
                    $("<div class='wrapper'><div class='column' id='column_left'></div><div class='column' id='column_right'></div></div>").appendTo(div);

                    var left = $("#column_left");
                    var right = $("#column_right");

                    $("<input type='button' class='button link' id='inbox_button' value='Inbox'/>").appendTo(left);
                    $("<input type='button' class='button link' id='outbox_button' value='Sent'/>").appendTo(left);

                    $("<div class='snog_container'></div>").appendTo(right);

                    var self = this;
                    $("#inbox_button").click(self.onInboxButtonClick);
                    $("#outbox_button").click(self.onOutboxButtonClick);
                },

                displayMessage: function( message, target, prepend ) {
                    // render div that contains login;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;

                    var div = $("<div class='snog_panel' id='message'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Message</span><br>").appendTo(div);
                    $("<div class='title'>Title: " + message.title + "</div>").appendTo(div);
                    $("<div class='title'>From: " + message.from_player_id + "</div>").appendTo(div);
                    $("<div class='body'>" + message.igm_entries[0].body + "</div>").appendTo(div);

                    $("<input type='button' class='button' id='delete_button' value='Delete'/>").appendTo(div);

                    // There are different types of messages, if message type is SM ( System Message ) disabled reply button;
                    $("<input type='button' class='button' id='reply_button' value='Reply' " + (message.type === "SM" ? "disabled" : "" ) + "/>").appendTo(div);

                    var self = this;
                    $("#delete_button").click( function(){ self.onDeleteButtonClick( message.igm_id) });
                    $("#reply_button").click( function(){ self.onReplyButtonClick( message.igm_id) });

                },

                destroy:function(){
                    $("#igm").remove();
                },

                destroyMessage: function(){
                    $("#message").remove();
                },

                displayCompose: function() {

                },

                displayReply: function() {

                },

                displayComposeGiftByEmail: function( target, prepend ){
                    // render div that contains login;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;

                    var div = $("<div class='snog_panel' id='compose'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Gift by email</span><br>").appendTo(div);
                    $("<span class='info'>The following example allows you to gift an existing item from your inventory. If you don't have any items, run butch example and get some. Select an item from the inventory by clicking on it, fill in the form and press 'send' button</span></br></br>").appendTo(div);
                    $("<span class=''>TO: </span><br>").appendTo(div);
                    $("<input type='text' id='email_input'><br>").appendTo(div);
                    $("<span>MESSAGE: </span><br>").appendTo(div);
                    $("<textarea type='text' id='message_input'></textarea>").appendTo(div);


                    $("<input type='button' class='button link' id='send_button' value='Send'/>").appendTo(div);
                    $("#send_button").click(this.onSendGiftButtonClick);
                },

                refreshInbox: function(data) {
                   var container = $(".snog_container");
                    if ( container ) {
                        this._renderMessage( container, data );
                    }
                },
                refreshOutbox: function(data) {
                    var container = $(".snog_container");
                    if ( container ) {
                        this._renderMessage( container, data );
                    }
                },

                _renderMessage: function( container, data ) {
                    container.children().remove();

                    var scope = this;
                    if ( data.length > 0 ) {
                        for (var i = 0; i < data.length; i++) {
                            var msg = data[i];
                            var div = $("<div class='snog_msg "+msg.status+"' data-igm-id='" + msg.igm_id + "'>" + (i+1) + ". <span>" + msg.title + "</span></div>");

                            // setup click function
                            div.click(function(event) {
                                scope.onMessageClick(event.currentTarget.getAttribute('data-igm-id'));
                            });

                            div.appendTo(container);
                        }
                    } else {
                        $("<div class='snog_msg'><span>You have no messages</span></div>").appendTo(container);
                    }

                },

                //--------------------------------------------------------------------------------------------
                // Button click handlers
                //--------------------------------------------------------------------------------------------

                onInboxButtonClick: function () {
                    // Send event to load inbox messages from the server;
                    snog_dispatcher.b(Snog.events.LOAD_INBOX_MESSAGES);
                },

                onOutboxButtonClick: function () {
                    // Send event to load outbox messages from the server;
                    snog_dispatcher.b(Snog.events.LOAD_OUTBOX_MESSAGES);
                },

                onMessageClick: function( igm_id ) {
                    // Send event to read whole message;
                    snog_dispatcher.b(Snog.events.READ_MESSAGE, {igm_id: igm_id});
                },

                onComposeButtonClick: function( igm_id ) {
                    snog_dispatcher.b(Snog.events.READ_MESSAGE, {igm_id: igm_id});
                },

                onDeleteButtonClick: function( igm_id ) {
                    snog_dispatcher.b(Snog.events.DELETE_MESSAGE, {igm_id: igm_id});
                },

                onReplyButtonClick: function( igm_id ) {
                    snog_dispatcher.b(Snog.events.REPLY_MESSAGE, {igm_id: igm_id});
                },

                onInventoryItemClick: function(target) {
                    $(".snog_item").removeClass("selected");
                    target.addClass("selected");
                    console.log( target );
                },

                onSendGiftButtonClick: function() {


                    // get selected item
                    var selected = $(".snog_item.selected")[0];
                    if ( selected ) {
                        var slot_id = parseInt( selected.getAttribute('data-slot-id'), 10 );
                        var slot = snog_data.getInventory().getSlotByID( slot_id );
                        var bag_id = snog_data.getInventory().bag_id;

                        if ( slot.item_instance !== null ) {

                            snog_dispatcher.b(Snog.events.GIFT_ITEM_VIA_EMAIL,
                                              {
                                                bag_id:bag_id,
                                                slot_id:slot_id,
                                                item_instance_uuid: slot.item_instance.item_instance_uuid,
                                                email: $("#email_input").val(),
                                                message: $("#message_input").val()
                                              });
                        }
                    }
                }
            },

            milestones: {

                /**
                 * Display milestones
                 * @param target
                 * @param prepend
                 */
                displayMilestones: function (target, prepend) {
                    // render div that contains friends;
                    var t = target === undefined ? $(module.exports.target) : $(target);
                    var p = prepend === undefined ? module.exports.prepend : prepend;
                    var div = $("<div class='snog_panel' id='milestones'></div>");

                    if (p) {
                        div.prependTo(t);
                    } else {
                        div.appendTo(t);
                    }

                    $("<span class='snog_header'>Milestones</span><br/>").appendTo(div);
                    $("<div class='snog_container'></div>").appendTo(div);
                },

                refresh: function (data) {
                    // destroy old results;
                    var container = $("#milestones > .snog_container"), i, j;
                    container.children().remove();

                    // Display results;
                    if (data !== null && data.length > 0) {

                        for (i = 0; i < data.length; i += 1) {
                            var milestone = data[i];
                            var milestone_div = $('<div class="milestone" ></div>');
                            var total_progress = 0;
                            var progress_step = 100 / milestone.steps.length;

                            for (j = 0; j < milestone.steps.length; j += 1) {
                                var step = milestone.steps[j];
                                var completed_class = step.hasOwnProperty('taken_at') ? "completed" : "";
                                var taken_date = completed_class != "" ? new Date(step.taken_at).toDateString() : "";
                                var step_div = $('<div class="step ' + completed_class + '" ><div class="dot ' + completed_class + '" ></div><div class="title">' + step.title + '</div><div class="date">' + taken_date + '</div></div>');
                                milestone_div.append(step_div);

                                // update total progress;
                                if (completed_class != "") {
                                    total_progress += progress_step;
                                }
                            }

                            container.append($('<div class="title" >' + milestone.title + '</div>'));
                            container.append($('<div class="description" >' + milestone.full_description + '</div>'));

                            // define progress text position
                            var progress_text_position = total_progress > 6 ? total_progress - 6 : 0;

                            container.append($('<div class="progressbar" ><div class="progress" style="width: ' + total_progress + '%"></div><div class="text" style="margin-left: ' + progress_text_position + '%">' + parseInt(total_progress) + '%</div></div>'));
                            container.append(milestone_div);

                            if (data.length > 1 && i < data.length - 1) {
                                container.append($('<div class="line" ><hr/></div>'));
                            }
                        }
                    } else {
                        $("<span class='snog_title'>There are no milestones found. Please try again.</span>").appendTo(container);
                    }
                },

                destroy: function () {
                    $("#milestones").remove();
                }
            },

            //--------------------------------------------------------------------------------------------
            // Functions
            //--------------------------------------------------------------------------------------------

            /**
             * Reset all input values in array;
             * [ '#id', ... ]
             * @param array
             */
            reset: function (array) {
                var i;
                for (i = 0; i < array.length; i += 1) {
                    var input = $(array[i]);
                    if (input) {
                        input.val('');
                    }
                }
            }
        };
    });
});