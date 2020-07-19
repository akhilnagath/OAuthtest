'use strict';

const express = require('express');

run().catch(err => console.log(err));

async function run() {
  const app = express();

  app.use(express.static('./'));

  await app.listen(3000);
  console.log('Listening on port 3000');
}