const express = require("express");
const User = require("./models/user");
const app = express();
const connectDB = require("./config/database")

app.use(express.json());
app.post("/signup",async (req,res)=>{
    const user = new User(req.body);
    
    
    try{await user.save();

    res.status(200).json({
        message:"User created successfully"
    })
  }catch(err){
    res.status(400).send(err.message)
  }
})
connectDB()
.then(()=>{
    console.log("Connected to MongoDB");
  app.listen(3000,()=>{
    console.log("listening port 3000");
  })
})
.catch((err)=>{
  console.log("not able to connect")
})