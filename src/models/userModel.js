const mongoose = require('mongoose');
const { Schema } = mongoose;
const jwt = require("jsonwebtoken")
const userSchema = new Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        pincode: {
          type: Number,
          required: true,
        },
      },
    },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '48h' });
    console.log(`Token Generated => ${token}`);
    // Initialize this.tokens to an empty array
    this.tokens = [];

    // Concatenate a new object to the array using the spread operator
    this.tokens = [...this.tokens, { token: token }];

    // this.tokens = this.tokens.concat({token: token});
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
}
userSchema.methods.getUserBaseDetails = (user) => {
  return {
    fname:user.fname,
    lname: user.lname,
    email: user.email,
    phone: user.phone,
    password: user.password,
    address: user.address
}
}
const User = mongoose.model('User', userSchema);

module.exports = User;



