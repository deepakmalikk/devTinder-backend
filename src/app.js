const express = require('express')
const app = express()
const port = 4001

 
app.get("/user",(req, res) => {
    res.send([{
        "name":"deepak",
        "lastName": "malik",
        "age":"25"
    }])
  })

  app.post("/user",(req,res)=>{
    res.send("data saved Sucessfully")
  })

  app.delete("/user",(req,res)=>{
    res.send("deleted sucessfully.")
  })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
