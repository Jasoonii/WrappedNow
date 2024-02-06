//var redirect_uri = "http://127.0.0.1:5500/home.html";
var redirect_uri = "https://wrappednow.netlify.app/";

var clientID = "7c93cb9ea0c8476cbae408755dfe92fa";
var clientSecret = "8e14ff226cc943989ae9de4846a1fb70";
var accessToken = localStorage.getItem("accessToken");
var refreshToken = localStorage.getItem("refreshToken");

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

function onPageLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    getTokens(code);
  }
}

function getTokens(code) {
  const tokenParams = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirect_uri,
    client_id: clientID,
    client_secret: clientSecret
  });

  const tokenOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: tokenParams
  };

  fetch(TOKEN_URL, tokenOptions)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      accessToken = data.access_token;
      refreshToken = data.refresh_token;
    })
    .catch(error => {
      console.error("Error: ", error);
    });
}

function getTopTracks(timeRange) {
  var endPoint = "https://api.spotify.com/v1/me/top/tracks?limit=10&offset=0&time_range=";

  if(timeRange == 1) {
    endPoint += "short_term";
  }
  else if(timeRange == 2) {
    endPoint += "medium_term";
  }
  else if(timeRange == 3) {
    endPoint += "long_term";
  }

  var headers = {
    Authorization: "Bearer " + accessToken
  };

  fetch(endPoint, { headers })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      displayTopTracks(data.items);
    })
    .catch(error => {
      console.error("Error: ", error);
    });
}

//Function is passed an array of songs
function displayTopTracks(tracks) {
  var topTracksContainer = document.getElementById("topTracksContainer");
  topTracksContainer.innerHTML = ""; // Clear the container before rendering

  //Goes through each song one by one
  for (var i = 0; i < tracks.length; i++) {
    var track = tracks[i];

    //Grabs attributes from each song
    var trackName = track.name;
    var trackLink = track.external_urls.spotify;
    var artistNames = track.artists.map(artist => artist.name).join(", ");
    var trackInfo = trackName + " - " + artistNames;

    //Creates an anchor element user can click on
    var trackElement = document.createElement("a");
    var lineBreak = document.createElement("br");

      //Displays song name
      trackElement.textContent = trackInfo;
      
      //Sets anchor to link to the song on Spotify
      trackElement.href = trackLink;
      trackElement.target = "_blank"

      //Styling the trackElement
      trackElement.style.color = "white";
      

    //Adds line break after every song.
    trackElement.classList.add("trackLink");
    topTracksContainer.appendChild(trackElement);
    topTracksContainer.appendChild(lineBreak);
  }
}

function getTopArtist(timeRange) {
  var endPoint = "https://api.spotify.com/v1/me/top/artists?limit=10&offset=0&time_range=";
  

  if(timeRange == 1) {
    endPoint += "short_term";
  }
  else if(timeRange == 2) {
    endPoint += "medium_term";
  }
  else if(timeRange == 3) {
    endPoint += "long_term";
  }

  var headers = {
    Authorization: "Bearer " + accessToken
  };

  fetch(endPoint, { headers })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      displayTopArtists(data.items);
    })
    .catch(error => {
      console.error("Error: ", error);
    });
}


/* Function is passed an array of artists */
function displayTopArtists(artists) {
  var topArtistsContainer = document.getElementById("topArtistsContainer");
  topArtistsContainer.innerHTML = ""; // Clear the container before rendering

  /* For loop displays artist one by one */
  for (var i = 0; i < artists.length; i++) {
    var artist = artists[i];
    var artistName = artist.name;
    
    //Gets array of all artist images, Chooses first image in array
    var artistImages = artist.images;
    var artistImage = artistImages[0];

    //Creates div to hold image and name.
    var artistElement = document.createElement("div")
    var artistNameElement = document.createElement("p");
    var artistImageElement = document.createElement("img");

    artistNameElement.style.marginBottom = "10px";

    //Sets image element to the first image in array from earlier
    artistImageElement.src = artistImage.url;
    artistImageElement.style.height = "64px";
    artistImageElement.style.width = "64px";
    artistNameElement.style.display = "inline-block";

    //Will display name of artist.
    artistNameElement.textContent = artistName;

    //Adds the name and artist picture to the div.
    artistElement.appendChild(artistImageElement);
    artistElement.appendChild(artistNameElement);
    artistElement.style.color = "white";
    topArtistsContainer.appendChild(artistElement);
  }
}

//Login function that requests permissions from Spotify
function requestAuth() {
  let url = AUTHORIZE;
  url += "?client_id=" + clientID;
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURI(redirect_uri);
  url += "&show_dialog_true";
  url += "&scope=user-read-private user-read-email user-top-read";
  window.location.href = url;
}

function logout() {
  let url = redirect_uri;

  // Clear access token and refresh token from local storage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  // Reset the access token and refresh token variables
  accessToken = null;
  refreshToken = null;

  window.location.href= url;
}