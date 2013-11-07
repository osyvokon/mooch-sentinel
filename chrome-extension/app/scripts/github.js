var GitHub = {
    baseUrl: 'https://api.github.com',
    user: null,
    repositories: null,

    requestStatus: function () {
        console.log('GitHub requestStatus');
        this.user = localStorage['gitHubLogin'];
        this.initRepositories(this.checkLastCommit);
    },

    hasLogin: function() {
        return !!localStorage['gitHubLogin'];
    },

    initRepositories: function (callback) {
        var me = this;
        if (me.user) {
            var url = me.baseUrl + "/users/" + me.user + "/repos";
            this.getJsonData(url, true, function (data) {
                if (data && data.length > 0) {
                    var repositories = [];
                    for (var i = 0; i < data.length; i++) {
                        var repo = data[i];
                        repositories.push(repo.name);
                    }
                    me.repositories = repositories;
                    console.log("GitHub repositories: " + JSON.stringify(me.repositories));
                    if (callback) {
                        callback.call(me);
                    }
                }
                else {
                    me.repositories = null;
                    console.error('No GitHub repositories data found! User: ' + me.user);
                }
            });
        }
    },

    checkLastCommit: function () {
        console.log('Getting last commit...');
        var me = this, lastCommitDate = null;
        console.log("GitHub repositories: " + JSON.stringify(me.repositories));
        if (me.repositories) {
            for (var i = 0; i < me.repositories.length; i++) {
                var repo = me.repositories[i];
                console.log('Processing repo ' + repo);
                var url = me.baseUrl + '/repos/' + me.user + '/' + repo + '/commits';

                // synchronous
                me.getJsonData(url, false, function (data) {
                    // need to get last commit, it goes first
                    if (data && data.length > 0) {
                        var commit = data[0]['commit'];
                        console.log(commit);
                        if (commit && commit['author'] && commit['author']['date']) {
                            var commitDate = new Date(commit['author']['date']);
                            console.log(commitDate);
                            if (lastCommitDate == null || lastCommitDate < commitDate) {
                                lastCommitDate = commitDate;
                                console.log('Setting last commit day to ' + lastCommitDate);
                            }
                        }
                    }
                    else {
                        console.log("No GitHub commits found! User: " + me.user + ", repo: " + repo);
                    }
                });
            }
        }
        console.log('Checking last commit date...');
        if (lastCommitDate) {
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastCommitDate >= yesterday) {
                console.log('GitHub commit date good!');
                me.ok = true;
                return;
            }
        }
        // no hands, no cookies
        console.log('no hands, no cookies');
        me.ok = false;
    },

    getJsonData: function (url, async, callback) {
        var me = this;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, async);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var data = JSON.parse(xhr.responseText);
                if (callback) {
                    callback.call(me, data);
                }
            }
        }
        xhr.send();
    }
}

