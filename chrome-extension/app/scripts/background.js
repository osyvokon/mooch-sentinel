'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
    chrome.alarms.clearAll();
    chrome.alarms.create("moochStatusRefresh", {
        when: Date.now() + 1,
        periodInMinutes: 1
    });
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log("on alarm", alarm);
    if (alarm.name == "moochStatusRefresh") {

        if (GitHub.hasLogin()) {
            console.log('requesting for GitHub...');
            GitHub.requestStatus();
        }
        else {
            console.log("No GitHub login.");
        }
        if (CodeForces.hasLogin()) {
            console.log('requesting for CodeForces...');
            CodeForces.requestStatus();
        }
        else {
            console.log("No CodeForces login.");
        }
    }
});


