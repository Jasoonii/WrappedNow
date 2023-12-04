var redirect_uri = "http://127.0.0.1:5500/home.html"

var clientID = "7c93cb9ea0c8476cbae408755dfe92fa";
var clientSecret = "8e14ff226cc943989ae9de4846a1fb70";

function onPageLoad() {
    if(window.location.search.length > 0) {
        var authParameters = {
              method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + clientID + '&client_secret=' + clientSecret
        }

        fetch('https://accounts.spotify.com/api/token', authParameters)
            .then(result => result.json())
            //.then(data => console.log(data))
            .then(data => localStorage.setItem("accessToken", data.access_token))
            
    }
}

function requestAuth() {

    let url = AUTHORIZE;
    url += "?client_id=" + clientID;
    url +="&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog_true";
    url += "&scope=user-read-private user-read-email user-top-read"
    window.location.href = url;
}