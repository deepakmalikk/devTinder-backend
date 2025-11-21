const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Helper: cookie options depending on environment
const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,                // true in production (HTTPS), false locally (http)
    sameSite: isProd ? "none" : "lax", // none for cross-site when in production
    maxAge: 8 * 3600000,           // 8 hours in ms (you used expires previously)
    // path: '/', // default ok 
  };
};

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password,isPremium, photoUrl, about, skills } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    

    //   Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      isPremium,
      photoUrl,
      about
,
skills    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

     // Set cookie with secure options
    res.cookie("token", token, getCookieOptions());

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
  

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

        // Set cookie with secure options
    res.cookie("token", token, getCookieOptions());
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token", getCookieOptions());
  res.send("Logout Successful!!");
});

module.exports = authRouter;