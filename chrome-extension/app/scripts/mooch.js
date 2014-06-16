var MoochSentinel = {
    statuses: [],

    updateStatuses: function () {
        console.log("MoochSentinel.updateStatuses()");
        if (GitHub.hasLogin())
            GitHub.requestStatus();

        if (BitBucket.hasLogin())
            BitBucket.requestStatus();

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

    isDateValid: function (date) {
        var sameDay = function (date1, date2) {
          if (typeof date1.toDateString !== 'function') date1 = new Date(date1);
          return date1.toDateString() == date2.toDateString();
        };
        return date && sameDay(date, new Date());
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

    setStatus: function (name, value, okDate, error) {
        var me = this;
        var existing = me.findStatus(name);
        if (existing) {
            existing.value = value;
            existing.okDate = okDate;
            existing.error = error;
        } else {
            me.statuses.push({name: name, value: value, okDate: okDate, error: error});
        }

        if (value) {
          var historyDates = localStorage['historyDates'] || "";
          if (historyDates.indexOf(okDate / 1000) == -1) {
            historyDates += ",";
            historyDates += okDate / 1000;
          }
          localStorage['historyDates'] = historyDates;
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
* request should look like {requestType: 'status', name: 'service name', okDate: timestamp }
*/
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log('message', arguments);
        var wasOk = MoochSentinel.isOk();
        if (request['requestType'] && request['requestType'] == 'status') {
            var ok = MoochSentinel.isDateValid(request.okDate) && !request.error;
            MoochSentinel.setStatus(request.name, ok, request.okDate, request.error);
            MoochSentinel.render();

            var statusChanged = (MoochSentinel.isOk() != wasOk);
            if (statusChanged) {
              chrome.runtime.sendMessage({requestType: 'statusChanged'});
            }
        }

        if (request['requestType'] && request['requestType'] == 'optionsChanged') {
          console.log("Received optionsChanged message");
          MoochSentinel.updateBlockingFilter();
          MoochSentinel.updateStatuses();
        }
    });

chrome.runtime.onMessageExternal.addListener(
    function (request, sender) {
        if (sender.update)
            MoochSentinel.updateStatuses();
    });


MoochSentinel.updateBlockingFilter();
