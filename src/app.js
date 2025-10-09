const express = require('express')
const app = express()
const port = 4001

app.use("/test",(req, res) => {
  res.send('Hello from server')
})
app.use("/",(req, res) => {
    res.send('Hello ')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
