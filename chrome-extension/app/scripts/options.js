'use strict';

function saveOptions() {
    var login = $('#login')[0].value;
    localStorage['moochLogin'] = login;
    var gitHubLogin = $('#ghLogin')[0].value;
    localStorage['gitHubLogin'] = gitHubLogin;
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
