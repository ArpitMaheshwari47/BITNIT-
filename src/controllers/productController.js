const Product = require('../models/productModel')
const User = require("../models/userModel")
const {productValidation} = require("../validator/validation")
const helper = require("../helper/helper");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const data = req.body;

    const { error, value } = productValidation(req.body);
    if (error) {
      return helper.sendError(res, {error}, 'Invalid credentials!');
    }
    
    const product = new Product(value);
    await product.save();
    return res.status(201).json(product);
  } catch (err) {
   // return res.status(500).json({status:false, message:err.message});
   return helper.sendServerError(res, err);
  }
};

// Get a single product by id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(product);
  } catch (err) {
   // return res.status(500).json({status:false, message:err.message});
   return helper.sendServerError(res, err);
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(product);
  } catch (err) {
   // return res.status(500).json({status:false, message:err.message});
   return helper.sendServerError(res, err);
  }
};

// Delete a product by setting the isDeleted flag to true
const deleteProduct = async (req, res) => {
  try {
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
   return  res.json({ message: 'Product deleted successfully' });
  } catch (err) {
   // return res.status(500).json({status:false, message:err.message});
   return helper.sendServerError(res, err);
  }
};

module.exports = { createProduct, getProductById, updateProduct, deleteProduct };


