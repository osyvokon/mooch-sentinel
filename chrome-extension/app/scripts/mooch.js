var MoochSentinel = {
    statuses: [],
    okDate: null,

    updateStatuses: function () {
        console.log("MoochSentinel.updateStatuses()");
        if (GitHub.hasLogin())
            GitHub.requestStatus();

        if (CodeForces.hasLogin())
            CodeForces.requestStatus();
    },

    isOk: function () {
        var me = this, result = false;
        $.each(me.statuses, function (idx, status) {
            if (status.value) {
                result = true;
            }
        });
        console.log('Mooch statuses: ', me.statuses);
        console.log('Mooch status: ', result);
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
        var okDate = this.okDate;
        var daysBetween = function (date1, date2) {
            // The number of milliseconds in one day
            var ONE_DAY = 1000 * 60 * 60 * 24;
            // Calculate the difference in milliseconds
            var difference_ms = Math.abs(date1.getTime() - date2.getTime());
            // Convert back to days and return
            return Math.round(difference_ms / ONE_DAY)
        };
        var sameDay = function (date1, date2) {
          return date1.toDateString() == date2.toDateString();
        };
        return okDate == null || sameDay(okDate, new Date());
    },

    hasStatuses: function () {
        return this.statuses && this.statuses.length > 0;
    },

    findStatus: function (name) {
        var me = this, result = null;
        if (me.hasStatuses()) {
            $.each(me.statuses, function (idx, status) {
                if (status.name == name) {
                    result = status;
                }
            })
        }
        return result;
    },

    setStatus: function (name, value) {
        var me = this;
        var existing = me.findStatus(name);
        if (existing) {
            existing.value = value;
        }
        else {
            me.statuses.push({name: name, value: value});
        }
    },


    updateBlockingFilter: function () {
        var options = {
            urls: MoochSentinel.blockedUrls().length > 0 ? MoochSentinel.blockedUrls() : ["<disabled>"],
            types: ["main_frame"]
        }

      chrome.webRequest.onBeforeRequest.removeListener(MoochSentinel._blockingFilter);
      chrome.webRequest.onBeforeRequest.addListener(MoochSentinel._blockingFilter, options, ["blocking"]);
    },

    _blockingFilter: function (details) {
          // we don't have to block if no status has been checked yet
          if (MoochSentinel.hasStatuses() && !MoochSentinel.isOk()) {
            var redirect = chrome.extension.getURL('blocked.html');
            console.log("interrupting request to ", details.url);
            console.log("redirect: " + redirect);
            return redirect ? { redirectUrl: redirect } : {cancel: true};
          }
          return null;
    }

}



/***
* request should look like {requestType: 'status', name: 'service name', ok: true/false, okDate: timestamp }
*/
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log('message', arguments);
        var wasOk = MoochSentinel.isOk();
        if (request['requestType'] && request['requestType'] == 'status') {
            MoochSentinel.setStatus(request.name, request.ok);
            MoochSentinel.render();
            var isOk = MoochSentinel.isOk();
            if (isOk) {
                var statusChanged = (isOk != wasOk);
                var date = request.okDate ? new Date(request.okDate): new Date();
                if (statusChanged) {
                    console.log("Setting last OK date to " + date);
                    MoochSentinel.okDate = date;
                }
                else {
                    // status is OK and was OK, but the date might be stale
                    if (MoochSentinel.isLastDateExpired()) {
                        console.log("Setting last OK date to " + date);
                        MoochSentinel.okDate = date;
                    }
                }
            }
        }

        if (request['requestType'] && request['requestType'] == 'updateBlockingFilter') {
          console.log("Recieved updateBlockingFilter");
          MoochSentinel.updateBlockingFilter();
        }
    });

chrome.runtime.onMessageExternal.addListener(
    function (request, sender) {
        if (sender.update)
            MoochSentinel.updateStatuses();
    });


MoochSentinel.updateBlockingFilter();
