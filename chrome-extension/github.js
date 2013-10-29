var GitHub = {
    baseUrl: 'https://api.github.com',
    user: null,
    repositories: null,
    commits: null,
    ok: false,

    requestStatus: function () {
        this.user = localStorage['gitHubLogin'];
        this.initRepositories();
    },

    initRepositories: function () {
        var me = this;
        if (me.user) {
            var url = me.baseUrl + "/users/" + me.user + "/repos";
            this.getJsonData(url, function (data) {
                if (data && data.length > 0) {
                    var repositories = [];
                    for (var i = 0; i < data.length; i++) {
                        var repo = data[i];
                        repositories.push(repo.name);
                    }
                    me.repositories = repositories;
                    console.log("GitHub repositories: " + JSON.stringify(me.repositories));
                }
                else {
                    me.repositories = null;
                    console.error('No GitHub repositories data found! User: ' + me.user);
                }
            });
        }
    },

    getJsonData: function (url, callback) {
        var me = this;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
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