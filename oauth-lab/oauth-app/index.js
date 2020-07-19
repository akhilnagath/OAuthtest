// main app server
'use strict';

const express = require("express");
const path = require("path");
const axios = require('axios');

const app = express();
const port = process.env.PORT || "8000";

// App Config
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

// Using local varibles instead of DB for the purpose of demo.
var userData = {}
var userToken; //temp implementation, not scalable.

// Routes
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

app.get("/login", (req, res) => {
    res.render("login", { title: "SignIn" });
});

app.get("/logout", (req, res) => {
    userData = null;
    userToken = "";
    res.redirect('/');
});

app.get("/user", (req, res) => {
    res.render("user", userData);
});

// Authentication
// Route to get the callback authcode and access token
app.get("/api/callback", async (req, res) => {
    var authCode = req.query.code;
    console.log("Auth Code: " + authCode);

    // submit user authcode for access token
    var resToken = await axios.post('http://localhost:3001/api/token', { 
        code: authCode 
    })
    .then(function (response) {
        console.log("Access Token: " + response.data['access_token']);
        userToken = response.data['access_token'];
    })

    // get authenticated user data from auth provider
    const userProfile = await axios.get('http://localhost:3001/secure', {
        headers: { authorization: userToken }
    })
    .then(function (response) {
        console.log(response['data']);
        userData = response['data'];
    })

    // redirect to /user profile
    res.redirect('/user');
});

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});