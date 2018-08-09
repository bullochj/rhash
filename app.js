/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START app]
'use strict';

// [START setup]
const express = require('express');
const bodyParser = require('body-parser');
const Buffer = require('safe-buffer').Buffer;
const mysql = require('mysql');
//const morgan = require("morgan")

const app = express();

app.set('case sensitive routing', true);
app.use(bodyParser.json());
// [END setup]

app.post('/echo', (req, res) => {
  res.status(200).json({ message: req.body.message }).end();
});

app.get("/timeline", (req, res) => {
    console.log("fetching timeline with id:" + req.params.id)
  
    const connection = mysql.createConnection({
      host: '35.230.172.223',
      user: 'root',
      password: 'TigmafjegWykva9',
      database: 'rhash'
    })
  
    const querystring = "SELECT C.FullyQualifiedName, S.Name, CurrentStartDate, CurrentEndDate FROM Timeline T LEFT JOIN Customer C ON C.ID = T.ClientID LEFT JOIN Stage S ON S.ID = T.StageID"
    connection.query(querystring, (err, rows, fields) => {
      if (err) {
        console.log("failed to query timeline: " + err)
        res.sendStatus(500)
        return
      }
  
      console.log("fetched timeline data")
  
      const tline = rows.map((row) => {
        return {Client: row.FullyQualifiedName, Stage: row.Name, Start: row.CurrentStartDate, End: row.CurrentEndDate}
      })
  
      res.json(tline)
    })
  
  })
  
function authInfoHandler (req, res) {
  let authUser = { id: 'anonymous' };
  const encodedInfo = req.get('X-Endpoint-API-UserInfo');
  if (encodedInfo) {
    authUser = JSON.parse(Buffer.from(encodedInfo, 'base64'));
  }
  res.status(200).json(authUser).end();
}

app.get('/auth/info/googlejwt', authInfoHandler);
app.get('/auth/info/googleidtoken', authInfoHandler);

if (module === require.main) {
  // [START listen]
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });
  // [END listen]
}
// [END app]

module.exports = app;