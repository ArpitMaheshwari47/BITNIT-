const express = require('express');
const router = express.Router();

const { createUser,loginUser, getUser ,updateUser , deleteUser} = require('../controllers/userController');
const { createProduct, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { Payment, sendCode, sendVerification } = require('../controllers/transactionController');

const {authenticate} = require("../middleware/auth")

router.post('/users', createUser);
router.post('/login', loginUser);
router.get('/users/:id', getUser);
router.put('/users/:id',authenticate, updateUser);
router.delete('/users/:id',authenticate, deleteUser);

router.post('/products' ,createProduct);
router.get('/products/:', getProductById);
router.put('/products/:id', authenticate,updateProduct);
router.delete('/products/:id', authenticate,deleteProduct);

router.post('/payments',authenticate,Payment );
router.post('/payments/send-verification-code',authenticate,sendCode);
router.post('/payments/verify-code',authenticate, sendVerification);

module.exports = router;

