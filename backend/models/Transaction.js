const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  note: { type: String, default: 'Savings' },
  total: { type: Number, required: true },
  notes: {
    500: { type: Number, default: 0 },
    200: { type: Number, default: 0 },
    100: { type: Number, default: 0 },
    50: { type: Number, default: 0 },
    20: { type: Number, default: 0 },
    10: { type: Number, default: 0 }
  },
  500: { type: Number, default: 0 },
  200: { type: Number, default: 0 },
  100: { type: Number, default: 0 },
  50: { type: Number, default: 0 },
  20: { type: Number, default: 0 },
  10: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
