var MoochSentinel = {

    render: function (status) {
        if (status.okay) {
            var msg = "Okay";
            var color = [255, 0, 0, 0];
        } else {
            var msg = "Blocked";
            var color = [0, 255, 0, 0];
        }

        document.getElementById("status").innerText = msg;
        chrome.browserAction.setBadgeText({text: msg});
        // chrome.browserAction.setBadgeColor({color: color});
    },

    requestStatus: function () {
        var user = localStorage['moochLogin'];
        if (!user) {
            document.getElementById("status").innerText = "Please, set user login on options page";
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://mooch.co.vu:5000/status/" + user, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = JSON.parse(xhr.responseText);
                MoochSentinel.render(status);
            }
        }
        xhr.send();
    }
}


document.addEventListener("DOMContentLoaded", function () {
    MoochSentinel.requestStatus();
    GitHub.requestStatus();
});
