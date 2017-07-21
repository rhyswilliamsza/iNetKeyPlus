/**
 * Rhys Williams
 * me@rhyswilliams.co.za
 * https://rhyswilliams.co.za
 */

var apiURL = "https://maties2.sun.ac.za/RTAD4-RPC3";
var username = "null";
var password = "null";

function connect(username, password) {
    this.username = username;
    this.password = password;
    open();
    startKeepAlive();
}

function setStats(response) {
    var balance = document.getElementById("balanceText");
    var yearUsage = document.getElementById("yearUsageText");
    var monthUsage = document.getElementById("monthUsageText");

    balance.innerHTML = parseInt(response[0]['balance']) + "MB";
    yearUsage.innerHTML = parseInt(response[0]['yearusage']) + "MB";
    monthUsage.innerHTML = parseInt(response[0]['monthusage']) + "MB";
}

var keepAlive;

function startKeepAlive() {
    keepAlive = setInterval(function () {
        open();
    }, 60000);
}

function endKeepAlive() {
    clearInterval(keepAlive);
}

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
            document.getElementById("status").innerHTML = response[0]['resultmsg'];
            console.log(response);
            showNotice(parseInt(response[0]['balance']) + "MB", "#27ae60");
            setStats(response);
        },
        error: function (jqXHR, status, error) {
            console.log(error);
        }
    });
}

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
            document.getElementById("status").innerHTML = response[0]['resultmsg'];
            console.log(response);
        },
        error: function (jqXHR, status, error) {
            console.log(error);
        }
    });
}