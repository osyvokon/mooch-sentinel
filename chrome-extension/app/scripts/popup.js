'use strict';
var MoochSentinel = {
    statuses: {
        gitHub: false,
        codeForces: false
    },

    isOk: function () {
        var result = false;
        for (var i = 0; i < this.statuses.length; i++) {
            var status = this.statuses[i];
            if (status) {
                result = true;
                break;
            }
        }
        console.log("Mooch status: " + result);
        return result;
    },

    setPopupElementText: function(id, text) {
        var htmlElement = document.getElementById(id);
        if (htmlElement) {
            htmlElement.innerText = text;
        }
    },

    render: function () {
        console.log("mooch render...");
        if (this.isOk()) {
            var msg = "Okay";
            var color = [255, 0, 0, 0];
        } else {
            var msg = "Blocked";
            var color = [0, 255, 0, 0];
        }
        this.setPopupElementText('status', '' + this.statuses.codeForces);
        this.setPopupElementText('ghStatus', '' + this.statuses.gitHub);
        chrome.browserAction.setBadgeText({text: msg});
        // chrome.browserAction.setBadgeColor({color: color}); // FIXME
    },

    checkCodeForcesLogin: function () {
        console.log('check CodeForces login...');
        var el = document.getElementById("status");
        if (!CodeForces.hasLogin()) {
            el.innerText = "Please set CodeForces user login on options page";
            return false;
        }
        return true;
    },

    checkGitHubLogin: function () {
        console.log('check GitHub login...');
        var user = localStorage['gitHubLogin'];
        var el = document.getElementById("ghStatus");
        if (!GitHub.hasLogin()) {
            el.innerText = "Please set GitHub user login on options page";
            return false;
        }
        return true;
    },

    refresh: function () {
        console.log('Mooch refresh...');
        if (this.checkCodeForcesLogin() || this.checkGitHubLogin()) {
            this.render();
        }
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("message", arguments);
        if (request.codeForces) {
            MoochSentinel.statuses.codeForces = request.ok;
            MoochSentinel.render();
        }
        if (request.gitHub) {
            MoochSentinel.statuses.gitHub = request.ok;
            MoochSentinel.render();
        }
    });

document.addEventListener("DOMContentLoaded", function () {
    MoochSentinel.refresh();
});
