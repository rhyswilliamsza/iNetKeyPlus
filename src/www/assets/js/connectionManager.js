/**
 * Rhys Williams
 * me@rhyswilliams.co.za
 * https://rhyswilliams.co.za
 */

var apiURL = "https://maties2.sun.ac.za/RTAD4-RPC3";
var username = "null";
var password = "null";
var connected = false;

/**
 * Connect or disconnect to/from the network, based on current state.
 * @param username Student Number of Student
 * @param password Password of Student
 */
function connectDisconnect(username, password) {
    this.username = username;
    this.password = password;
    if (connected) {
        close();
        connected = false;
        endKeepAlive();
    } else {
        open();
        connected = true;
        startKeepAlive();
    }
}

/**
 * Set the stats of the Status Bar
 * @param balanceString current account balance
 * @param year current year usage
 * @param month current month usage
 */
function setStats(balanceString, year, month) {
    var balance = document.getElementById("balanceText");
    var yearUsage = document.getElementById("yearUsageText");
    var monthUsage = document.getElementById("monthUsageText");

    balance.innerHTML = balanceString;
    yearUsage.innerHTML = year;
    monthUsage.innerHTML = month;
}

//Keep Alive Tracker
var keepAlive;

/**
 * Poll to keep connection alive, if connected.
 */
function startKeepAlive() {
    keepAlive = setInterval(function () {
        open();
    }, 60000);
}

/**
 * Stop keeping connection alive
 */
function endKeepAlive() {
    clearInterval(keepAlive);
}

/**
 * Open the connection by sending a request to the firewall
 */
function open() {
    $.xmlrpc({
        url: apiURL,
        methodName: 'rtad4inetkey_api_open2',
        params: [{
            'platform': 'any',
            'requser': this.username,
            'reqpwd': this.password,
            'keepalive': 0
        }],
        success: function (response, status, jqXHR) {
            console.log(response);

            //Check for Out of Balance
            if (response[0]['resultmsg'].includes("Out of credit")) {
                showNotice("No Credit", "#f7ca18");
                setStats("R" + parseInt(response[0]['balance']), "R" + parseInt(response[0]['yearusage']), "R" + parseInt(response[0]['monthusage']));
            }

            //Check for Incorrect Password
            if (response[0]['resultmsg'].includes("Invalid username or password")) {
                showNotice("Re-Login", "#EF4836");
                setStats("~", "~", "~");
                setTimeout(function () {
                    removeCredentials();
                }, 2000);
            }

            //Connect
            if (response[0]['resultmsg'].includes("Success")) {
                showNotice("R" + parseInt(response[0]['balance']), "#27ae60");
                setStats("R" + parseInt(response[0]['balance']), "R" + parseInt(response[0]['yearusage']), "R" + parseInt(response[0]['monthusage']));
            }
        },
        error: function (jqXHR, status, error) {
            console.log(error);
        }
    });
}

/**
 * Close the connection by sending a request to the firewall
 */
function close() {
    $.xmlrpc({
        url: apiURL,
        methodName: 'rtad4inetkey_api_close2',
        params: [{
            'platform': 'any',
            'requser': this.username,
            'reqpwd': this.password
        }],
        success: function (response, status, jqXHR) {
            console.log(response);
            showNotice("Closed", "#2980b9");
            setStats("~", "~", "~");
        },
        error: function (jqXHR, status, error) {
            console.log(error);
        }
    });
}