'use strict';

const cors = require('cors');
const express = require('express');

run().catch(err => console.log(err));

async function run() {
  const app = express();
  const authCodes = new Set();
  const accessTokens = new Set();

  app.use(express.json());

  app.get('/api/grant', (req, res) => {
    const authCode = new Array(10).fill(null).map(() => Math.floor(Math.random() * 10)).join('');
    authCodes.add(authCode);
    let domain = req.query.redirect_uri; // http://localhost:3000/api/callback
    if (domain != null){
      res.redirect(`${domain}?code=${authCode}`);
    }else{
      res.sendStatus(204);
    }});

  app.options('/api/token', cors(), (req, res) => res.end());
  app.options('/secure', cors(), (req, res) => res.end());

  app.post('/api/token', cors(), (req, res) => {
    if (authCodes.has(req.body.code)) {
      const token = new Array(50).fill(null).map(() => Math.floor(Math.random() * 10)).join('');
      authCodes.delete(req.body.code);
      accessTokens.add(token);
      console.log("Access Token created: " + token);
      res.json({ 'access_token': token, 'expires_in': 60 * 60 * 24 });
    } else {
      res.status(400).json({ message: 'Invalid auth token' });
    }
  });

  app.get('/secure', cors(), (req, res) => {
    const authorization = req.get('authorization');
    if (!accessTokens.has(authorization)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    // return user information if authToken is valid
    return res.json({ title: "Profile", userProfile: { nickname: "Admin", email: "admin@oauthlab.com", phone: "+91 123456789", flag: "flag{o4uth_0p3nredir3ct}" } });
  });

  app.use(express.static('./'));

  await app.listen(3001);
  console.log("OAuth authentication server.")
  console.log('Listening on port 3001..');
}