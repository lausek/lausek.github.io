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
        document.cookie += "cookies-allowed=1"; 
        document.getElementById("box-cookie-warning").remove();
    };

});
