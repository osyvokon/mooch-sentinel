'use strict';

function saveOptions() {
    var login = $('#login')[0].value;
    localStorage['moochLogin'] = login;
    var gitHubLogin = $('#ghLogin')[0].value;
    localStorage['gitHubLogin'] = gitHubLogin;
    var urlInputs = $('#blockedUrlTable').find('input');
    var urls = [];

    var cleanUrl = function (s) {
        var url = s ? s.trim() : '';
        if (url) {
            url = url.replace(/http:\/\/|https:\/\//ig, "");
        }
        return url;
    }
    var padUrl = function (url) {
        return "*://" + url + (url.indexOf("/") == url.length - 1 ? '*' : '/*');
    }

    if (urlInputs && urlInputs.length > 0) {
        $.each(urlInputs, function (idx, field) {
            var url = cleanUrl(field.value);
            if (url) {
                urls.push(padUrl(url));
                // we need to also store "www" version of the url
                var secondUrl = (url.indexOf("www") == 0 ? url.substring(4) : "www." + url);
                urls.push(padUrl(secondUrl));
            }
        })
    }
    localStorage['blockedUrls'] = urls;
}

function stripUrls(urls) {
    var result = [];
    var stripUrl = function (url) {
        return url.replace(/^\*:\/\//ig, "").replace(/\/\*$/ig, "").replace(/^www\./ig, "");
    }
    $.each(urls, function (idx, url) {
        var stripped = stripUrl(url);
        if (result.indexOf(stripped) < 0) {
            result.push(stripped);
        }

    });
    return result;
}

function restoreOptions() {
    var login = localStorage['moochLogin'];
    if (login) {
        $('#login')[0].value = login;
    }
    var gitHubLogin = localStorage['gitHubLogin'];
    if (gitHubLogin) {
        $('#ghLogin')[0].value = gitHubLogin;
    }
    var blockedUrls = localStorage['blockedUrls'] ? localStorage['blockedUrls'].split(',') : [];
    if (blockedUrls.length == 0) {
        blockedUrls.push("facebook.com", "twitter.com");
    }
    blockedUrls = stripUrls(blockedUrls);
    $.each(blockedUrls, function (idx, url) {
        addUrlInput(url);
    });
    $('#save').on('click', saveOptions);
    $('#addUrlButton').on('click', addUrlInput);
    $('.removeUrlButton').on('click', removeUrl);
}

function addUrlInput(content) {
    if (content == null || (typeof content) != 'string') {
        content = '';
    }
    // looking for the last row: with "Add URL" button
    var tr = $('#blockedUrlTable').find('.addUrl');
    $(tr).before('<tr><td><input type="text" class="form-control input-sm" maxlength="1024" value="' + content + '"/></td></tr>');
    $(tr).prev().append($('<td><button class="removeUrlButton btn btn-sm">Remove</button></td>').on('click', removeUrl));
}

function removeUrl() {
    $(this).parents('tr').remove();
}

document.addEventListener('DOMContentLoaded', restoreOptions);
