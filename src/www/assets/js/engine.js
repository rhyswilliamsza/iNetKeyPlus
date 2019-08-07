/**
 * Rhys Williams
 * iNETKEY+
 * @type {string}
 */

//LOGIN Manager ------------------------------------->

var username;
var password;
var ready = false;
var menuOpen = false;

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

    //Start Animation
    startAnimation();
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
    closeMenu();
    checkCredentials();
    showNotice("Welcome", "#2980b9");
}


//MENU Manager ---------------

/**
 * Manage menu open/close
 */
function manageMenu() {
    if (menuOpen) {
        menuOpen = false;
        closeMenu();
    } else {
        menuOpen = true;
        openMenu();
    }
}

/**
 * Open the hamburger menu
 */
function openMenu() {
    document.getElementById("menu").style.animation = "openMenu 0.4s forwards";
    document.getElementById("content_container").style.animation = "shiftRight 0.4s forwards";
}

/**
 * Close the hamburger menu
 */
function closeMenu() {
    document.getElementById("menu").style.animation = "closeMenu 0.4s forwards";
    document.getElementById("content_container").style.animation = "shiftLeft 0.4s forwards";
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

function startAnimation() {
    document.getElementById("onenotice").style.animation = "rotate 2.5s alternate infinite";
    document.getElementById("twonotice").style.animation = "rotate 2.6s alternate infinite";
    document.getElementById("threenotice").style.animation = "rotate 2.7s alternate infinite";
}

function stopAnimation() {
    document.getElementById("onenotice").style.animation = "";
    document.getElementById("twonotice").style.animation = "";
    document.getElementById("threenotice").style.animation = "";
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
            hidden: true,
            bigText: false
        });

        cordova.plugins.backgroundMode.setEnabled(true);
        cordova.plugins.backgroundMode.overrideBackButton();

        ready = true;
    }, false);

    document.addEventListener('pause', function () {
        stopAnimation();
    }, false);

    document.addEventListener('resume', function () {
        startAnimation();
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