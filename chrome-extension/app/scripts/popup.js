'use strict';
var Popup = {

    render: function () {
        console.log('rerendering popup...');
        var bg = chrome.extension.getBackgroundPage();
        if (!bg || !bg['MoochSentinel']) {
            console.log('No background page!');
            return;
        }
        var sentinel = bg['MoochSentinel'];
        console.log('sentinel', sentinel);
        this.setStatusText("status", sentinel.findStatus('codeForces'), "CodeForces puzzles");
        this.setStatusText("ghStatus", sentinel.findStatus('gitHub'), "GitHub commits");
    },

    setStatusText: function (id, status, label) {
        if (!status) {
            $("#" + id)[0].innerHTML = '';
        }
        else {
            var label = "";
            if (status.value) {
              label = "<span class='label status-green'>done!</span>";
            } else {
              label = "<span class='label status-red'>you mooch!</span>";
            }
            $("#" + id)[0].innerHTML = label;
        }
    },

    checkCodeForcesLogin: function () {
        console.log('check CodeForces login...');
        var el = $('#status')[0];
        if (!localStorage['moochLogin']) {
            el.innerText = 'Please set CodeForces user login on options page';
            return false;
        }
        return true;
    },

    checkGitHubLogin: function () {
        console.log('check GitHub login...');
        var el = $('#ghStatus')[0];
        if (!localStorage['gitHubLogin']) {
            el.innerText = 'Please set GitHub user login on options page';
            return false;
        }
        return true;
    },

    refresh: function () {
        console.log('Popup refresh...');
        if (this.checkCodeForcesLogin() || this.checkGitHubLogin()) {
            this.render();
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("btnRefresh").onclick = function () {
        MoochSentinel.updateStatuses();
        Popup.refresh();
    }
    Popup.refresh();
});

