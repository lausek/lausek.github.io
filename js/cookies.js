document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    var cookie = decodeURIComponent(document.cookie).split(";");
    for (var i = 0; i < cookie.length; i++) {
        var parts = cookie[i].split("=");
        if (parts[0] === "cookies-allowed") {
            document.getElementById("box-cookie-warning").remove();
            return; 
        }
    }

    document.getElementById("box-confirm-cookie").onclick = function () {
        var date = new Date();
        // set expire after 30 days
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        document.cookie += "cookies-allowed=1;expires=" + date.toUTCString() + ";path=/";
        document.getElementById("box-cookie-warning").remove();
    };

});
