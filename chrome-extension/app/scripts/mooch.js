var MoochSentinel = {
    statuses: {
        gitHub: false,
        codeForces: false,
        okDate: null
    },

    updateStatuses: function() {
        console.log("MoochSentinel.updateStatuses()");

        if (GitHub.hasLogin())
            GitHub.requestStatus();

        if (CodeForces.hasLogin())
            CodeForces.requestStatus();
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
        console.log('Mooch statuses: ' + me.statuses);
        console.log('Mooch status: ' + result);
        return result;
    },

    blockedUrls: function () {
        return localStorage['blockedUrls'] ? localStorage['blockedUrls'].split(',') : [];
    },

    render: function () {
        console.log('rerendering badge...');
        var color = null;
        if (this.isOk()) {
            var msg = 'Okay';
            color = '#0F0';
        } else {
            var msg = 'Blocked';
            color = '#F00';
        }
        chrome.browserAction.setBadgeText({text: msg});
        if (color) {
            chrome.browserAction.setBadgeBackgroundColor({color: color});
        }
    },

    isLastDateExpired: function () {
        var okDate = this.statuses.okDate;
        var daysBetween = function (date1, date2) {
            // The number of milliseconds in one day
            var ONE_DAY = 1000 * 60 * 60 * 24
            // Calculate the difference in milliseconds
            var difference_ms = Math.abs(date1.getTime() - date2.getTime());
            // Convert back to days and return
            return Math.round(difference_ms / ONE_DAY)
        };
        return okDate == null
            || daysBetween(new Date(), okDate) >= 1;
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log('message', arguments);
        var wasOk = MoochSentinel.isOk();
        if (request.codeForces) {
            MoochSentinel.statuses.codeForces = request.ok;
            MoochSentinel.render();
        }
        if (request.gitHub) {
            MoochSentinel.statuses.gitHub = request.ok;
            MoochSentinel.render();
        }
        var isOk = MoochSentinel.isOk();
        if (isOk) {
            var statusChanged = (isOk != wasOk);
            var date = new Date();
            if (statusChanged) {
                console.log("Setting last OK date to " + date);
                MoochSentinel.statuses.okDate = date;
            }
            else {
                // status is OK and was OK, but the date might be stale
                if (MoochSentinel.isLastDateExpired()) {
                    console.log("Setting last OK date to " + date);
                    MoochSentinel.statuses.okDate = date;
                }
            }
        }
    });

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
      if (sender.update)
        MoochSentinel.updateStatuses();
    });

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (!MoochSentinel.isOk()) {
            var redirect = chrome.extension.getURL('blocked.html');
            console.log("interrupting request to ", details.url);
            console.log("redirect: " + redirect);
            return redirect ? { redirectUrl: redirect } : {cancel: true};
        }
    },
    {
        urls: MoochSentinel.blockedUrls() || ["<disabled>"],
        types: ["main_frame"]
    },
    ["blocking"]);
