'use strict';
var Popup = {

    init: function () {
      Popup.refresh();
      var cal = new CalHeatMap();
      var startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 2);
      var data = {};
      var historyDates = localStorage['historyDates'] || "";
      historyDates.split(",").forEach( function (date) {
        if (date != "") {
          data[date] = 16;
        }
      });

      cal.init({
        domain: "month",
        range: 3,
        start: startDate,
        cellSize: 10,
        cellRadius: 2,
        highlight: "now",
        displayLegend: false,
        data: data
      });
    },

    getSentinel: function () {
        var bg = chrome.extension.getBackgroundPage();
        if (!bg || !bg['MoochSentinel']) {
            console.log('No background page!');
            return null;
        } else {
            return bg['MoochSentinel'];
        }
    },

    render: function () {
        console.log('rerendering popup...');
        var sentinel = Popup.getSentinel();
        if (!sentinel) return;
        this.setStatusText("status", sentinel.findStatus('codeForces'), "CodeForces puzzles");
        this.setStatusText("ghStatus", sentinel.findStatus('gitHub'), "GitHub commits");
        this.setStatusText("bitbucketStatus", sentinel.findStatus('bitbucket'), "BitBucket commits");
    },

    setStatusText: function (id, status, label) {
        console.log("setStatusText: ", id, status);
        var label = "";
        if (!status) {
            label = "<span class='label status-grey'>disabled</span>";
        } else if (status.value) {
            label = "<span class='label status-green'>done!</span>";
        } else if (status.error) {
            label = "<span class='label status-red'>" + status.error + "<span>";
        } else {
            label = "<span class='label status-red'>you mooch!</span>";
        }
        console.log(label);
        $("#" + id)[0].innerHTML = label;
    },

    checkCodeForcesLogin: function () {
        var el = $('#status')[0];
        if (!localStorage['codeforcesLogin']) {
            el.innerText = 'Please set CodeForces user login on options page';
            return false;
        }
        return true;
    },

    checkGitHubLogin: function () {
        var el = $('#ghStatus')[0];
        if (!localStorage['gitHubLogin']) {
            el.innerText = 'Please set GitHub user login on options page';
            return false;
        }
        return true;
    },

    checkBitBucketLogin: function () {
        var el = $('#bitbucketStatus')[0];
        if (!localStorage['bitbucketLogin']) {
            el.innerText = 'Please set BitBucket user login on options page';
            return false;
        }
        return true;
    },

    refresh: function () {
        console.log('Popup refresh...');
        if (this.checkCodeForcesLogin() || this.checkGitHubLogin() || this.checkBitBucketLogin()) {     // TODO: do we still need this?
            this.render();
        }
    },

    requestUpdate: function () {
        Popup.getSentinel().updateStatuses();
    }

}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request['requestType'] && request['requestType'] == 'statusChanged') {
          console.log("Got message: statusChanged");
          Popup.refresh();
        }
    });

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("btnRefresh").onclick = Popup.requestUpdate;
    Popup.init();
});

