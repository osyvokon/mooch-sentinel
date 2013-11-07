var CodeForces = {
    ok: false,

    hasLogin: function () {
        return !!localStorage['moochLogin'];
    },

    requestStatus: function () {
        console.log('CodeForces requestStatus');
        var me = this;
        me.ok = false;
        var user = localStorage['moochLogin'];
        if (user) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://mooch.co.vu:5000/status/" + user, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var status = JSON.parse(xhr.responseText);
                    me.ok = !!status.okay;
                    return;
                }
            }
            xhr.send();
        }
    }
}
