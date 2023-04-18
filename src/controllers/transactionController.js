const Joi = require('joi');
const helper = require("../helper/helper");
const uuidv4 = require('uuid').v4;
const Transaction = require('../models/transactionModel');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {paymentValidation,transactionValidation,verificationvalidation} = require("../validator/validation")



const Payment = async (req, res) => {
  try {
    const { error } = paymentValidation(req.body);
    if (error) {
      return helper.sendError(res, {}, 'Invalid credentials!');
    }
    // Create a new transaction with a unique transaction ID
    const transactionId = uuidv4();
    const transaction = new Transaction({
      productId:req.body.productId,
      amount:req.body.price,
      currencyId: 'INR',
      currencyFormat: '₹',
      status: 'initiated',
      transactionId,
    });

    // Save the transaction to the database
    await transaction.save();
    return res.status(200).json({
      message: 'Payment initiated successfully',
      transactionId,
    });

  } catch (err) {
    // return res.status(500).json({status:false, message:err.message});
    return helper.sendServerError(res, err);
  }
};
const sendCode = async (req, res) => {
  try {
    const { error, value } = transactionValidation(req.body);
    if (error) {
      return helper.sendValidatorError(res, {}, 'Invalid credentials!');
    }
    const transaction = await Transaction.findOne({
      transactionId: value.transactionId,
    });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    transaction.verificationCode = code;
    transaction.status = 'processing';
    try {
      await transaction.save();
      console.log(transaction);
    } catch (error) {
      console.error(error);
    }

    const transporter = nodemailer.createTransport(
      sendgridTransport({
        service: 'gmail',
        auth: {
          api_key:process.env.API_KEY,
        },
      })
    );

    const mailOptions = {
      to: process.env.EMAIL_USER,
      from:process.env.EMAIL_HOST,
      subject: 'Verification Code for Payment',
      text: `Your verification code for the payment is ${transaction.verificationCode}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Email sending failed' });
      } else {
        console.log('Email sent');

      }
    });

    return res.status(200).json({
      message: 'Verification code sent successfully',
      transactionId: transaction.transactionId,
      code:transaction.verificationCode
    });
  } catch (err) {
   // return res.status(500).json({status:false, message:err.message});
   return helper.sendServerError(res, err);
  }
};

  // Verify code and complete transaction
  const sendVerification = async (req, res) => {
    try {
        const { error, value } = verificationvalidation(req.body);
        if (error) {
          return helper.sendValidatorError(res, {}, 'Invalid credentials!');
        }
        const transaction = await Transaction.findOne({
            transactionId: value.transactionId,
        });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        console.log(transaction)
        if (transaction.verificationCode !== value.verificationCode) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }
        transaction.status = 'completed';
        await transaction.save();
        res.json({ message: 'Transaction completed successfully' });
    } catch (err) {
        // return res.status(500).json({status:false, message:err.message});
    return helper.sendServerError(res, err);
    }
};

module.exports  = { Payment, sendCode, sendVerification };















