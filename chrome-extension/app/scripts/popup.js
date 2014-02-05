'use strict';
var Popup = {

    setPopupElementText: function (id, text) {
        var htmlElement = document.getElementById(id);
        if (htmlElement) {
            htmlElement.innerText = text;
        }
    },

    render: function () {
        console.log('rerendering popup...');
        var bg = chrome.extension.getBackgroundPage();
        if (!bg || !bg['MoochSentinel']) {
            console.log('No background page!');
            return;
        }
        var sentinel = bg['MoochSentinel'];
        console.log('sentinel', sentinel);
        this.setPopupElementText('status', '' + sentinel.statuses.codeForces);
        this.setPopupElementText('ghStatus', '' + sentinel.statuses.gitHub);
        var data = {
            '1383926200': 10
        };
        this.renderCalendar(data);
    },

    renderCalendar: function (data) {
        if (!this.cal) {
          var startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
          this.cal = new CalHeatMap();
          this.cal.init({
              domain: 'month',
              range: 2,
              start: startDate,
              cellSize: 10,
              cellRadius: 2,
              highlight: 'now',
              data: data
          });
        } else {
          this.cal.update(data);
        }
    },

    checkCodeForcesLogin: function () {
        console.log('check CodeForces login...');
        var el = document.getElementById('status');
        if (!localStorage['moochLogin']) {
            el.innerText = 'Please set CodeForces user login on options page';
            return false;
        }
        return true;
    },

    checkGitHubLogin: function () {
        console.log('check GitHub login...');
        var el = document.getElementById('ghStatus');
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
    document.getElementById("btnRefresh").onclick = function(e) {
      MoochSentinel.updateStatuses();
      Popup.refresh();
    }

    Popup.refresh();
});

