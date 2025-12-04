// routes/user.js
const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// ------------------------------
// Get all pending connection requests for the logged-in user
// ------------------------------
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    // Filter out any broken requests where fromUserId is null
    const safeRequests = connectionRequests.filter((r) => r.fromUserId);

    res.json({
      message: "Data fetched successfully",
      data: safeRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// ------------------------------
// Get all accepted connections for the logged-in user
// ------------------------------
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests
      .map((row) => {
        const from = row.fromUserId;
        const to = row.toUserId;

        // skip corrupted rows
        if (!from || !to) return null;

        if (from._id.toString() === loggedInUser._id.toString()) {
          return to;
        }
        return from;
      })
      .filter(Boolean); // remove nulls

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// ------------------------------
// Feed: Suggest users to connect with
// - hide logged-in user
// - hide users where a request already exists (either direction)
// ------------------------------
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    // Start with logged-in user in the hidden set
    const hideUsersFromFeed = new Set([loggedInUser._id.toString()]);

    connectionRequests.forEach((reqDoc) => {
      if (reqDoc.fromUserId) {
        hideUsersFromFeed.add(reqDoc.fromUserId.toString());
      }
      if (reqDoc.toUserId) {
        hideUsersFromFeed.add(reqDoc.toUserId.toString());
      }
    });

    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
