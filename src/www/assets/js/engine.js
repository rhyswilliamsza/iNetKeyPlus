/**
 * Rhys Williams
 * iNETKEY+
 * @type {string}
 */

//LOGIN Manager ------------------------------------->

var username;
var password;
var ready = false;

/**
 * On Window Load, Show Welcoming Screen and Add Event Listener
 */
window.onload = function () {
    //Do Init Tasks
    enable_background();
    checkCredentials();

    document.getElementById("notice").addEventListener('click', function () {

        if (!is_connected_wifi()) {
            showNotice("No Wifi", "#f7ca18");
            setTimeout(function () {
                showNotice("Tap Here", "#2980b9");
            }, 2000);
        } else {
            connectDisconnect(username, password);
        }
    });

    //Show Ready to Start
    showNotice("Tap Here", "#2980b9");
};

/**
 * Show login screen to user
 */
function showLogin() {
    document.getElementById("loginContainer").style.display = "flex";
}

/**
 * Make login screen disappear
 */
function hideLogin() {
    $("#loginContainer").fadeOut();
}

/**
 * Check if credentials are stored. If not, show login screen.
 */
function checkCredentials () {
    var storage = window.localStorage;
    username = storage.getItem("username");
    password = storage.getItem("password");

    if (username === null || password === null) {
        showLogin();
    }
}

/**
 * Store user credentials into local storage
 */
function storeCredentials () {
    var storage = window.localStorage;

    //Get Info
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;

    //Store Info
    storage.setItem("username", username);
    storage.setItem("password", password);

    //Hide Login
    hideLogin();
}


/**
 * Remove user credentials from local storage
 */
function removeCredentials () {
    var storage = window.localStorage;
    storage.removeItem("username");
    storage.removeItem("password");
    checkCredentials();
    showNotice("Welcome", "#2980b9");
}



//NOTICE Manager ------------------------------------->

/**
 * Show notice of string notice and colour colour
 * @param notice notice to show
 * @param colour background colour
 */
function showNotice(notice, colour) {
    $("#noticetitle").text(notice);
    document.getElementById("notice").style.backgroundColor = colour;
    $("notice").fadeIn();

    set_notification(notice, colour);
}

/**
 * Hide notice
 */
function hideNotice() {
    $("notice").fadeOut();
}


//Utilities Manager ------------------------------------->

/**
 * Enable Background Mode
 */
function enable_background() {

    //Adds device listener to keep app open in the background (stop the connection from dying)
    document.addEventListener('deviceready', function () {

        cordova.plugins.backgroundMode.setDefaults({
            title: "iNetKey+",
            text: "Tap to Open",
            icon: 'icon',
            color: "2980b9",
            resume: true,
            hidden: false,
            bigText: false
        });

        cordova.plugins.backgroundMode.enable();
        cordova.plugins.backgroundMode.overrideBackButton();

        ready = true;
    }, false);
}

/**
 * Set Notification
 */
function set_notification(message, colour) {
    if (ready) {
        cordova.plugins.backgroundMode.configure({
            text: message,
            color: colour.replace("#", "")
        });
    }
}


/**
 * Check that user is connected to wifi
 */
function is_connected_wifi() {
    if (navigator.connection.type === 'wifi') {
        return true;
    } else {
        return false;
    }
}