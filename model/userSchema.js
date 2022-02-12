const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  work: { type: String, required: true },
  password: { type: String, required: true },
  cpassword: { type: String, required: true },
});

//method that is pre ---> because the below code for password hashing is called before saving data into DB

//we will not use ()=? fat arrow function ...we cannot access elements using this keyword
userSchema.pre("save", async function (next) {
  console.log("m from inside middleware");
  //for hasing password ---> hash() we use
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }

  next();
});

module.exports = mongoose.model("USER", userSchema);
