'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.runtime.onLaunched.addListener(function () {
    chrome.alarms.create("moochStatusRefresh", {
        when: Date.now(),
        periodInMinutes: 1
    });
});

chrome.runtime.onSuspend.addListener(function () {
    console.log('cleaning up...');
    chrome.alarms.clearAll();
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name == "moochStatusRefresh") {
        if (GitHub.hasLogin()) {
            console.log('requesting for GitHub...');
            GitHub.requestStatus();
        }
        if (CodeForces.hasLogin()) {
            console.log('requesting for CodeForces...');
            CodeForces.requestStatus();
        }
    }
});


