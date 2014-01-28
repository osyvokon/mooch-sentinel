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

function restoreOptions() {
    var login = localStorage['moochLogin'];
    if (login) {
        $('#login')[0].value = login;
    }
    var gitHubLogin = localStorage['gitHubLogin'];
    if (gitHubLogin) {
        $('#ghLogin')[0].value = gitHubLogin;
    }
    $('#save').on('click', saveOptions);
    $('#addUrlButton').on('click', addUrl);
    $('.removeUrlButton').on('click', removeUrl);
}

function addUrl() {
    var tr = $(this).parents('tr')[0];
    $(tr).before('<tr><td><input type="text" maxlength="1024" value=""/></td></tr>');
    $(tr).prev().find('td').append($('<button class="removeUrlButton">Remove</button>').on('click', removeUrl));
}

function removeUrl() {
    $(this).parents('tr').remove();
}

document.addEventListener('DOMContentLoaded', restoreOptions);
