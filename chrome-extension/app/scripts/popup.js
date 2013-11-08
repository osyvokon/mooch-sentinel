'use strict';
var MoochSentinel = {
    statuses: {
        gitHub: false,
        codeForces: false
    },

    isOk: function () {
        var me = this, result = false;
        for (status in me.statuses) {
            if (me.statuses.hasOwnProperty(status)) {
                if (me.statuses[status]) {
                    result = true;
                    break;
                }
            }
        }
        console.log("Mooch statuses: " + me.statuses);
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
        var color = null;
        if (this.isOk()) {
            var msg = "Okay";
            color = "#0F0";
        } else {
            var msg = "Blocked";
            color = "#F00";
        }
        this.setPopupElementText('status', '' + this.statuses.codeForces);
        this.setPopupElementText('ghStatus', '' + this.statuses.gitHub);
        chrome.browserAction.setBadgeText({text: msg});
        if (color) {
            chrome.browserAction.setBadgeBackgroundColor({color: color});
        }
    },

    checkCodeForcesLogin: function () {
        console.log('check CodeForces login...');
        var el = document.getElementById("status");
        if (!localStorage['moochLogin']) {
            el.innerText = "Please set CodeForces user login on options page";
            return false;
        }
        return true;
    },

    checkGitHubLogin: function () {
        console.log('check GitHub login...');
        var el = document.getElementById("ghStatus");
        if (!localStorage['gitHubLogin']) {
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
