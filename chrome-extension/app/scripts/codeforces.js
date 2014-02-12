var CodeForces = {
    ok: false,

    hasLogin: function () {
        return !!localStorage['moochLogin'];
    },

    requestStatus: function () {
        var me = this;
        me.ok = false;
        var user = localStorage['moochLogin'];
        if (!user) {
            console.log("User not set for CodeForces, nothing to do");
            return;
        }

        var url = "http://codeforces.ru/submissions/" + user;
        console.log("Going to fetch Codeforces from " + url);
        me.parseSubmissionsPage(url, function (submissions) {
            console.log("CodeForces submissions", submissions);
            var lastOkDate = null;
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (submissions.length == 0) {
              me.ok = false;
            } else {
              lastOkDate = submissions.sort(function(a,b) { return a.date < b.date? 1 : -1 })[0].date;
              me.ok = (lastOkDate >= yesterday);
            }

            console.log("Codeforces status: ", me.ok, ", lastOkDate: ", lastOkDate);
            me.sendStatus(lastOkDate);
        });
    },

    sendStatus: function (okDate) {
        chrome.runtime.sendMessage({requestType: 'status', name: 'codeForces', ok: this.ok, okDate: okDate});
    },

    parseSubmissionsPage: function (url, callback) {
        function parseDate(str) {
          var t = str.trim().split(/\W/).map(Number);
          return new Date(Date.UTC(t[2], t[1]-1, t[0], t[3], t[4], t[5]));   // str example: 15.10.2013 20:19:08
        }

        $.get(url, function(html) {
            var html = $(html);
            var rows = $('table.status-frame-datatable tr:not(.first-row)', html);
            var submissions = $.map(rows, function (row) {
                var $row = $(row);
                var verdictCell = $row.children('.status-verdict-cell').children('span')[0];
                var verdict = verdictCell? verdictCell.className : "";
                return {
                    'id': $row.data('submissionId').toString().trim(),
                    'date': parseDate($row.children('td')[1].innerText),
                    'okay': (verdict == 'verdict-accepted')
                }
            });
            var successfulSubmissions = submissions.filter(function(submission) { return submission.okay });

            callback(successfulSubmissions);
        });
    }
}
