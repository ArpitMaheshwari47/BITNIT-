const User = require('../models/userModel');
const helper = require("../helper/helper");
const {registerValidation , loginValidation} = require("../validator/validation")
const bcrypt = require("bcrypt")



const createUser =  async function (req,res) {
  try {
    const { error } = registerValidation(req.body);
    if (error) {
      return helper.sendValidatorError(res, {}, 'Invalid credentials!');
    }

    // Check if the user already exists
    const userExists = await User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] });
    if (userExists) {
      return helper.sendError(res, {}, `User already exists with email id ${req.body.email}`);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const newUser = new User({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
      address: req.body.address,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    return helper.sendSuccess(res, {savedUser}, 'User created Successfully! Login to continue');
  } catch (err) {
    // return res.status(500).json({status:false, message:err.message});
    return helper.sendServerError(res, err);
  }
}

const loginUser =  async (req, res) => {
  try {
      const data = req.body
    const { error } = loginValidation(data);
    if (error) {
      return helper.sendError(res, {}, 'Invalid credentials!');
    }

    // Find the user in the database by email
    let findQuery = {email: data.email};
    const foundUser = await User.findOne(findQuery);

    // If the user is not found, return a 401 response with the "invalid credentials" message
    if (!foundUser) return helper.sendError(res, {}, "invalid credentials");

    // Compare the provided password with the user's hashed password using bcrypt
    const cmprPassword = await bcrypt.compare(data.password, foundUser.password)

    // If the password doesn't match, return a 401 response with the "invalid credentials" message
    if (!foundUser || !cmprPassword) return res.status(401).send({
        status: false,
        message: "Invalid password!"
    })

   // Generate an auth token for the user
   const token = await foundUser.generateAuthToken();
   // Return a 200 response with the user ID and auth token in the response body
   return helper.sendSuccess(res, {
    userDetails: foundUser.getUserBaseDetails(foundUser),
    token: token
}, "User login successful");
  } catch (err) {
    return helper.sendServerError(res, err);
  }
}


// Get a single user by ID
const getUser =  async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return helper.sendError(res, {}, "User not found");
    }
    return helper.sendSuccess(res, {user});
  } catch (err) {
   // If there is an error, return a 500 response with the error message
   return helper.sendServerError(res, err);
  }
}

// Update a user by ID
const updateUser =  async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return helper.sendError(res, {}, "User not found");
    }
    return helper.sendSuccess(res, {user});
  } catch (err) {
    // If there is an error, return a 500 response with the error message
   return helper.sendServerError(res, err);
  }
}
 
// Delete a user by ID
const deleteUser =  async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return helper.sendError(res, {}, "User not found");
    }
   
    return helper.sendSuccess(res, {},"user deleted");
  } catch (err) {
   // If there is an error, return a 500 response with the error message
   return helper.sendServerError(res, err);
    }
}


    
  module.exports = {createUser,loginUser,getUser,updateUser,deleteUser}
