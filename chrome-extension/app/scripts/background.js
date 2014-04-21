'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
    chrome.alarms.clearAll();
    chrome.alarms.create('moochStatusRefresh', {
        when: Date.now() + 1,
        periodInMinutes: 5
    });
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log('on alarm', alarm);
    if (alarm.name == 'moochStatusRefresh') {

        if (GitHub.hasLogin()) {
          var status = MoochSentinel.findStatus('gitHub');
          if (!status || !status.value || !MoochSentinel.isDateValid(status.okDate)) {
            console.log('requesting for GitHub...');
            GitHub.requestStatus();
          }
        }

        if (CodeForces.hasLogin()) {
          var status = MoochSentinel.findStatus('codeForces');
          if (!status || !status.value || !MoochSentinel.isDateValid(status.okDate)) {
            console.log('requesting for CodeForces...');
            CodeForces.requestStatus();
          }
        }
    }
});


