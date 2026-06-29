const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStatistics,
  seedData
} = require('../controllers/transactionController');

router.route('/stats').get(getStatistics);
router.route('/seed').post(seedData);
router.route('/').get(getTransactions).post(createTransaction);
router.route('/:id').put(updateTransaction).delete(deleteTransaction);

module.exports = router;
