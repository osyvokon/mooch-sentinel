'use strict';
var MoochSentinel = {

    ok: false,

    render: function () {
        if (this.ok) {
            var msg = "Okay";
            var color = [255, 0, 0, 0];
        } else {
            var msg = "Blocked";
            var color = [0, 255, 0, 0];
        }
        document.getElementById("status").innerText = msg;
        chrome.browserAction.setBadgeText({text: msg});
        // chrome.browserAction.setBadgeColor({color: color}); // FIXME
    },

    requestCodeForces: function () {
        console.log('requestCodeForces...');
        var el = document.getElementById("status");
        if (!CodeForces.hasLogin()) {
            el.innerText = "Please set CodeForces user login on options page";
            return false;
        }
        el.innerText = CodeForces.ok ? "CodeForces OK" : "CodeForces blocked";
        console.log('requestCodeForces: ' + CodeForces.ok);
        return CodeForces.ok;
    },

    requestGitHub: function () {
        console.log('requestGitHub...');
        var user = localStorage['gitHubLogin'];
        var el = document.getElementById("ghStatus");
        if (!GitHub.hasLogin()) {
            el.innerText = "Please set GitHub user login on options page";
            return false;
        }
        el.innerText = GitHub.ok ? "GitHub OK" : "GitHub blocked";
        console.log('requestGitHub: ' + GitHub.ok);
        return GitHub.ok;
    },

    refresh: function() {
        console.log('Mooch refresh...');
        MoochSentinel.ok = MoochSentinel.requestCodeForces() || MoochSentinel.requestGitHub();
        MoochSentinel.render();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    MoochSentinel.refresh();
});
