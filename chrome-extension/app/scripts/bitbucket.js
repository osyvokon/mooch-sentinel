var BitBucket = {

  hasLogin: function () {
    return !!localStorage['bitbucketLogin'] && !!localStorage['bitbucketRepo'];
  },

  getLastChangeset: function (user, repo, callback, fail) {
    var url = "https://bitbucket.org/api/1.0/repositories/" + user + "/" + repo + "/changesets/";
    $.ajax({
      dataType: "json",
      url: url,
      data: {limit: 1},
      success: callback,
      statusCode: {
        403: function () {
          fail("Forbidden: please, sign in into your accout")
        }
      }
    });
  },

  requestStatus: function () {
    if (!this.hasLogin()) return;

    var user = localStorage['bitbucketLogin'];
    var repo = localStorage['bitbucketRepo'];
    console.log("BitBucket.requestStatus")
    BitBucket.getLastChangeset(user, repo, function (response) {
      console.log("Got BitBucket changesets:", response);
      var changesets = response.changesets;
      console.log("timestamp", changesets[0].timestamp);
      console.log(Date.parse(changesets[0].timestamp));

      chrome.runtime.sendMessage({
        requestType: 'status',
        name: 'bitbucket',
        ok: null,        // TODO: deprecated, get rid of this
        okDate: changesets.length? Date.parse(changesets[0].timestamp) : null
      });
    }, function (reason) {
      console.log("BB error", reason);
      chrome.runtime.sendMessage({
        requestType: 'status',
        name: 'bitbucket',
        ok: null,        // TODO: deprecated, get rid of this
        okDate: null,
        error: reason
      });

    });
  }

}
