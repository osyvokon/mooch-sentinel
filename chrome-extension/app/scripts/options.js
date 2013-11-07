'use strict';

function save_options() {
    var login = document.getElementById("login").value;
    localStorage["moochLogin"] = login;
    var gitHubLogin = document.getElementById("ghLogin").value;
    localStorage["gitHubLogin"] = gitHubLogin;
}

function restore_options() {
    var login = localStorage["moochLogin"];
    if (login) {
        document.getElementById("login").value = login;
    }
    var gitHubLogin = localStorage["gitHubLogin"];
    if (gitHubLogin) {
        document.getElementById("ghLogin").value = gitHubLogin;
    }

    document.querySelector("#save").addEventListener("click", save_options);
}

document.addEventListener("DOMContentLoaded", restore_options);
