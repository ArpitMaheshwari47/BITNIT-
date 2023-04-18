const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currencyId: {
      type: String,
      required: true,
    },
    currencyFormat: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['initiated', 'processing', 'completed', 'failed'],
      default: 'initiated',
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    verificationCode: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;

