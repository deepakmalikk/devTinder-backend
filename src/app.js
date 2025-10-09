const express = require("express");

const app =express();
const port = 3000;

app.use("/user",(req,res,next)=>{
    console.log("route handler 1");
    next();
},
(req,res,next)=>{
    console.log("route handler 2");
    next();
},
(req,res,next)=>{
    res.send("response from 3")
}

)

app.listen(port,()=>{
    console.log(`listing port ${port}`)
});