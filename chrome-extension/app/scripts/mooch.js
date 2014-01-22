var MoochSentinel = {
    statuses: {
        gitHub: false,
        codeForces: false
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
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log('message', arguments);
        if (request.codeForces) {
            MoochSentinel.statuses.codeForces = request.ok;
            MoochSentinel.render();
        }
        if (request.gitHub) {
            MoochSentinel.statuses.gitHub = request.ok;
            MoochSentinel.render();
        }
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
    {urls: ["*://www.example.com/*"]},
    ["blocking"]);