var CodeForces = {
    ok: false,

    hasLogin: function () {
        return !!localStorage['moochLogin'];
    },

    requestStatus: function () {
        var me = this;
        me.ok = false;
        var user = localStorage['moochLogin'];
        if (user) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://mooch.co.vu:5000/status/" + user, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.responseText) {
                        var status = JSON.parse(xhr.responseText);
                        me.ok = !!status.okay;
                        chrome.runtime.sendMessage({codeForces: true, ok: me.ok});
                    }
                    else {
                        console.log('Empty CodeForces response!');
                        chrome.runtime.sendMessage({codeForces: true, ok: me.ok});
                    }
                }
            }
            xhr.send();
        }
    },

    parseSubmissionsPage: function (url) {
        var html = $("<div></div>").load(url);
        var rows = $("table.status-frame-datatable tr:not(.first-row)", html);
        var submissions = rows.map(function (row) {
            var $row = $(row);
            var verdict = $row.children(".status-verdict-cell").children("span")[0].className;
            return {
                "id": row.data("submissionId"),
                "date": $row.children("td")[1].innerText,
                "okay": (verdict == "verdict-accepted")
            }
        });

        return submissions.toArray();
    }
}
