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
            // TODO implement status change
//            me.ok = !!status.okay;
//            me.sendStatus(lastOkDate);
        });
    },

    sendStatus: function (okDate) {
        chrome.runtime.sendMessage({requestType: 'status', name: 'codeForces', ok: this.ok, okDate: okDate});
    },

    parseSubmissionsPage: function (url, callback) {
        var html = $('<div style="display: none"></div>');
        html.load(url, function () {
            var rows = $('table.status-frame-datatable tr:not(.first-row)', html);
            var submissions = $.map(rows, function (row) {
                var $row = $(row);
                var verdict = $row.children('.status-verdict-cell').children('span')[0].className;
                return {
                    'id': $row.data('submissionId'),
                    'date': $row.children('td')[1].innerText,
                    'okay': (verdict == 'verdict-accepted')
                }
            });

            callback(submissions);
        });
    }
}
