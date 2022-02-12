const express = require("express");
const router = express.Router();
//we need connection for db
require("../db/conn");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.cookie("jwt", "get token");
});

router.post("/register", async (req, res) => {
  //we can use object destructuring

  const { name, email, phone, work, password, cpassword } = req.body;

  //we want that data which we got from UI we want to store it into our mongo db

  //befor that we need to check if the user email address is already present in our DB , we will check it
  //middleware

  //for checking that user has filled all the fields or not
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(404).json({ error: "pls fill all the fields properly" });
  }

  //now it means user has properly filled the form , now check for the email id ..does the email already there in our DB
  //use middleware

  //collection name . findOne()
  //since it is interacting with DB hence it will return us the promise --> means either it will be able to find the data or it will fail to find it

  /*  Using PROMISE  */

  //   User.findOne({ email: req.body.email })
  //     .then((userExist) => {
  //       if (userExist) {
  //         return res.status(404).json({ error: "email id already registered" });
  //       }

  //       //otherwise its a new user , i need to take the value from the user and save it in our db
  //       const user = new User({ name, email, phone, work, password, cpassword });

  //       //we have to save it to our DB ...again DB intereaction, it will return us promise
  //       user
  //         .save()
  //         .then(() => {
  //           res.status(201).json({ message: "user registered successfully" });
  //         })
  //         .catch((error) => {
  //           //so this is DB error --> becoz if its a new email then it should register it
  //           res.status(500).json({ error: "failed to register" });
  //         });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  // using ASYNC AWAIT

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(422).json({ error: "email id already registered" });
    }
    if (password !== cpassword) {
      return res.status(422).json({ error: "password not matching" });
    }

    //we need to save the data in our DB
    const user = new User({ name, email, phone, work, password, cpassword });

    //here we have to use middleware which will convert the password in hashing format before saving it into Database

    const response = await user.save();

    if (response)
      return res.status(201).json({ message: "user registered successfully" });

    return res.status(500).json({ message: "failed to register" });
  } catch (err) {
    console.log(err);
  }
});

//Login route
//after user has register successfully , he will then do login

router.post("/signin", async (req, res) => {
  //i  need email and password from UI
  const { email, password } = req.body;

  //we will check or DB collection ...email and password is present there or not

  //validation --> either email/password missing

  if (!email || !password) {
    return res.status(422).json({ error: "Pls fill all the details " });
  }

  //db check if email and password both are present

  //email id --> we will check this first

  try {
    const response = await User.findOne({ email: email });

    if (response) {
      console.log(response);
      return res.status(200).json({ message: "login success" });
    } else {
      return res.status(400).json({ message: "invalid credential" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
