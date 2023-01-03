require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Our routes go here:

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

//Iteration 3 | Search for an Artist/ Step 1 | Create a Homepage // index
app.get("/", (req, res, next) => {
  res.render("index");
});

//Iteration 3 | Search for an Artist/ Step 2 | Display results for artist search/artist-search
app.get("/artist-search", (req, res, next) => {
  console.log(req.query.artistName);
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//Iteration 4 | View Albums
app.get("/albums/:artistId", (req, res, next) => {
  console.log(req.params.artistId);
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      console.log(data);
      res.render("albums", { albums: data.body.items });
    })
    .catch((error) => console.log("Error", error));
});

//Iteration 5 | View Tracks
app.get("/tracks/:albumId", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId).then((data) => {
    console.log(data.body.items);
    res.render("tracks", { tracks: data.body.items });
  });
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
