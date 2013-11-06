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
    },

    requestGitHubStatus: function () {
        var user = localStorage['gitHubLogin'];
        var el = document.getElementById("ghStatus");
        if (!user) {
            el.innerText = "Please, set GitHub user login on options page";
            return;
        }
        GitHub.requestStatus(function (isOk) {
            if (isOk) {
                el.innerText = "GitHub OK";
            }
            else {
                el.innerText = "GitHub NOT OK";
            }
        });
    },

    refreshStatuses: function() {
        this.requestStatus();
        this.requestGitHubStatus();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("refreshing statuses for the first time...");
    MoochSentinel.refreshStatuses();
//    console.log("adding refresh listener...");
//    moochRefreshFunction = window.setInterval(function () {
//        console.log("repeating status call...");
//        MoochSentinel.refreshStatuses();
//    }, 60 * 1000);
});
