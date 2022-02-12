const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

//we need authentication data from .env files
dotenv.config({ path: "./config.env" });

//we need environment variables from .env files

const PORT = process.env.PORT;

//connecting with mongoDB

// const DB = process.env.DATABASE;

//mongo db connection is use in many places , so try to keep in another file

/* we will import the connection for mongodb file here  */
require("./db/conn.js");

//middleware use
app.use(express.json());

//now we will link routes with main file
//how to link using app.use(require(path))

app.use(require("./routes/auth"));

//now here we will need model
const User = require("./model/userSchema");
const { json } = require("express");

//middleware --is used for user authentication

const middleware = (req, res, next) => {
  console.log(
    "hello my middle ware : i will hold for sometime to authenticate user"
  );
  next();
};

app.get("/", (req, res) => {
  res.send("home page");
});

//which page we want to hide until and unless user is loged in
app.get("/about", middleware, (req, res) => {
  console.log("hello my about page");
  res.send("about page");
});

app.get("/contact", (req, res) => {
  res.send("contact page");
});

app.get("/signin", (req, res) => {
  res.send("signin page");
});

app.get("/signup", (req, res) => {
  res.send("signup page");
});

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
