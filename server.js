const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./userModel");
const reviewModel = require("./reviewModel");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const middleware = require("./middleware");
const cors = require("cors");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 4100;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected"));
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  return res.send("<h1>Welcome to DeveloperHub</h1>");
});

//for registration
app.post("/register", async (req, res) => {
  try {
    const { fullname, email, mobile, skills, password, confirmpassword } =
      req.body;
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.status(400).send("This email is already registered");
    }

    if (password !== confirmpassword) {
      return res.status(404).send("Oops! It seems the passwords don’t match");
    }

    const newUser = new userModel({
      fullname,
      email,
      mobile,
      skills,
      password,
      confirmpassword,
    });

    await newUser.save();
    return res.status(200).send("User registered successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

//for login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await userModel.findOne({ email });
    if (!exist) {
      return res.status(400).send("User does not exist");
    }
    if (exist.password !== password) {
      return res.status(400).send("The password is invalid");
    }

    let payload = {
      user: {
        id: exist.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        return res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

//all-profiles
app.get("/allprofiles", middleware, async (req, res) => {
  try {
    let allprofiles = await userModel.find();
    return res.json(allprofiles);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

//myprofile
app.get("/myprofile", middleware, async (req, res) => {
  try {
    let user = await userModel.findById(req.user.id);
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

//adding review
app.post("/addreview", middleware, async (req, res) => {
  try {
    const { taskworker, rating } = req.body;
    const exist = await userModel.findById(req.user.id);
    const newReview = new reviewModel({
      taskprovider: exist.fullname,
      taskworker,
      rating,
    });
    await newReview.save();
    return res.status(200).send("Review Updated successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

//my review
app.get("/myreviews", middleware, async (req, res) => {
  try {
    let allReviews = await reviewModel.find();
    let myReviews = allReviews.filter(
      (review) => review.taskworker.toString() === req.user.id.toString()
    );
    return res.status(200).json(myReviews);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/profile/:id", middleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () =>
  console.log(`Server running... on the PORT No. ${PORT}`)
);
