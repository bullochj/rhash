// load app server
const express = require("express")
const morgan = require("morgan")
const mysql = require("mysql")
const app = express()

app.use(morgan("short"))

app.get("/echo", (req, res) => {
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

app.get("/", (req, res) => {
  console.log("responding to root route")
  res.send("hello from Root")
})

//localhost:3003
app.listen(3003, () => {
  console.log("server is up")
})