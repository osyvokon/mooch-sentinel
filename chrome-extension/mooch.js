var user = 'silver';

var MoochSentinel = {

    render: function(status) {
      document.getElementById("status").innerText = status.okay? "Okay!" : "Blocked";
    },

    requestStatus: function() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://mooch.co.vu:5000/status/" + user, true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
              var status = JSON.parse(xhr.responseText);
              MoochSentinel.render(status);
          }
        }
        xhr.send();
    }
}


document.addEventListener("DOMContentLoaded", function() {
    MoochSentinel.requestStatus();
});
