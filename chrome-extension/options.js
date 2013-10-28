function save_options() {
    var login = document.getElementById("login").value;
    localStorage["moochLogin"] = login;
}

function restore_options() {
    var login = localStorage["moochLogin"];
    if (!login)
        return;
    document.getElementById("login").value = login;
}

document.addEventListener("DOMContentLoaded", restore_options);
document.querySelector("#save").addEventListener("click", save_options);
