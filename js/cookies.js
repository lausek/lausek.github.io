document.addEventListener("DOMContentLoaded", function () {

    "use strict";
    
    var cookie = decodeURIComponent(document.cookie).split(";");
    for (var i = 0; i < cookie.length; i++) {
        var parts = cookie[i].split("=");
        if (parts[0] === "cookies-allowed") {
            return; 
        }
    }

    var msg = document.createElement("div");
    msg.innerHTML = "This site uses cookies. <a href='https://wikipedia.org/wiki/Magic_cookie'>Learn more...</a>"; 
    msg.setAttribute("style", "height:auto;padding:10px;margin-top:10px;;vertical-align:middle;background-color:red;");

    var conf = document.createElement("button");
    conf.innerHTML = "okay";
    conf.setAttribute("style", "float:right;");
    conf.onclick = function () {
        document.cookie += "cookies-allowed=1"; 
        document.body.removeChild(msg);
    };

    msg.appendChild(conf);
    document.body.prepend(msg);

});
