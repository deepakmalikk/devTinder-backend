const express = require("express");
const User = require("./models/user");
const app = express();
const connectDB = require("./config/database")

app.use(express.json());
app.get("/feed", async (req, res) => {
  const userEmail = req.body.email;

  try {
    // To find specific user
    // const users = await User.find({ email: userEmail });

    // To find all user
    // const users = await User.find({});

    // To find user by Id
    const users = await User.findById("68e943abceea48e01d3c0ba5");
    res.send(users);
    if (users.length === 0) {
      res.status(404).send("Users not found");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// TO delete user

app.delete("/user",async(req,res)=>{
    const userId = req.body.id;

    try{
     await User.findByIdAndDelete(userId);
     res.status(200).send("User deleted successfully");
    }catch(err){
      res.status(400).send("Not able to delete user")
    }
})
// TO put dynamic data into database
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