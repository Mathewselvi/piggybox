const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Public
exports.createTransaction = async (req, res, next) => {
  try {
    const { date, time, note, notes, total } = req.body;
    
    const n = notes || {
      500: req.body['500'] || 0,
      200: req.body['200'] || 0,
      100: req.body['100'] || 0,
      50: req.body['50'] || 0,
      20: req.body['20'] || 0,
      10: req.body['10'] || 0
    };
    const transaction = await Transaction.create({
      date,
      time,
      note: note || 'Savings',
      total,
      notes: n,
      500: n['500'] || 0,
      200: n['200'] || 0,
      100: n['100'] || 0,
      50: n['50'] || 0,
      20: n['20'] || 0,
      10: n['10'] || 0
    });

    // Automatically allocate saved amount to active goals
    const activeGoals = await Goal.find({ completed: false }).sort({ createdAt: 1 });
    let remainingToAllocate = total;
    for (let goal of activeGoals) {
      if (remainingToAllocate <= 0) break;
      const needed = goal.targetAmount - goal.savedAmount;
      if (needed > 0) {
        const added = Math.min(needed, remainingToAllocate);
        goal.savedAmount += added;
        remainingToAllocate -= added;
        if (goal.savedAmount >= goal.targetAmount) {
          goal.completed = true;
        }
        await goal.save();
      }
    }

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Public
exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Public
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rich statistics
// @route   GET /api/transactions/stats
// @access  Public
exports.getStatistics = async (req, res, next) => {
  try {
    const transactions = await Transaction.find().sort({ date: 1, createdAt: 1 });
    
    let totalSavings = 0;
    let highestDeposit = 0;
    const totalNotes = { 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0 };
    const dailyMap = {};
    const monthlyMap = {};
    const yearlyMap = {};

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMonthStr = todayStr.substring(0, 7);

    let todaySavings = 0;
    let thisMonthSavings = 0;

    transactions.forEach(t => {
      totalSavings += t.total;
      if (t.total > highestDeposit) highestDeposit = t.total;

      // Note count
      const n = t.notes || {};
      totalNotes[500] += (n[500] || t['500'] || 0);
      totalNotes[200] += (n[200] || t['200'] || 0);
      totalNotes[100] += (n[100] || t['100'] || 0);
      totalNotes[50] += (n[50] || t['50'] || 0);
      totalNotes[20] += (n[20] || t['20'] || 0);
      totalNotes[10] += (n[10] || t['10'] || 0);

      // Maps for charts
      const dateKey = t.date || todayStr;
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + t.total;

      const monthKey = dateKey.substring(0, 7);
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + t.total;

      const yearKey = dateKey.substring(0, 4);
      yearlyMap[yearKey] = (yearlyMap[yearKey] || 0) + t.total;

      if (dateKey === todayStr) {
        todaySavings += t.total;
      }
      if (monthKey === currentMonthStr) {
        thisMonthSavings += t.total;
      }
    });

    const numberOfDeposits = transactions.length;
    const averageSavings = numberOfDeposits > 0 ? Math.round(totalSavings / numberOfDeposits) : 0;

    // Calculate Streak (consecutive days ending today or yesterday)
    const sortedDates = Object.keys(dailyMap).sort().reverse();
    let streak = 0;
    if (sortedDates.length > 0) {
      let checkDate = new Date();
      // check if today saved
      let checkStr = checkDate.toISOString().split('T')[0];
      if (!dailyMap[checkStr]) {
        // start checking from yesterday
        checkDate.setDate(checkDate.getDate() - 1);
        checkStr = checkDate.toISOString().split('T')[0];
      }
      while (dailyMap[checkStr]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
        checkStr = checkDate.toISOString().split('T')[0];
      }
    }

    // Format charts data
    const dailyChart = Object.keys(dailyMap).slice(-7).map(k => ({ name: k.slice(5), amount: dailyMap[k] }));
    const monthlyChart = Object.keys(monthlyMap).slice(-6).map(k => ({ name: k, amount: monthlyMap[k] }));
    const yearlyChart = Object.keys(yearlyMap).map(k => ({ name: k, amount: yearlyMap[k] }));

    const pieChart = [
      { name: '₹500', value: totalNotes[500], color: '#FF5CA8' },
      { name: '₹200', value: totalNotes[200], color: '#8B5CF6' },
      { name: '₹100', value: totalNotes[100], color: '#FFD166' },
      { name: '₹50', value: totalNotes[50], color: '#22C55E' },
      { name: '₹20', value: totalNotes[20], color: '#3B82F6' },
      { name: '₹10', value: totalNotes[10], color: '#F43F5E' },
    ].filter(item => item.value > 0);

    const latestEntry = transactions.length > 0 ? transactions[transactions.length - 1] : null;

    res.status(200).json({
      totalSavings,
      todaySavings,
      thisMonthSavings,
      streak,
      averageSavings,
      highestDeposit,
      numberOfDeposits,
      totalNotes,
      dailyChart,
      monthlyChart,
      yearlyChart,
      pieChart,
      latestEntry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed demo data
// @route   POST /api/transactions/seed
// @access  Public
exports.seedData = async (req, res, next) => {
  try {
    await Transaction.deleteMany({});
    await Goal.deleteMany({});

    const now = new Date();
    const getDateStr = (daysAgo) => {
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      return d.toISOString().split('T')[0];
    };

    const dummyTransactions = [
      { date: getDateStr(5), time: '10:30 AM', note: 'Festival', total: 2000, notes: { 500: 4, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0 }, 500: 4, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0 },
      { date: getDateStr(3), time: '02:15 PM', note: 'Pocket Money', total: 650, notes: { 500: 1, 200: 0, 100: 1, 50: 1, 20: 0, 10: 0 }, 500: 1, 200: 0, 100: 1, 50: 1, 20: 0, 10: 0 },
      { date: getDateStr(2), time: '06:45 PM', note: 'Gift', total: 1100, notes: { 500: 2, 200: 0, 100: 1, 50: 0, 20: 0, 10: 0 }, 500: 2, 200: 0, 100: 1, 50: 0, 20: 0, 10: 0 },
      { date: getDateStr(1), time: '09:10 AM', note: 'Savings', total: 500, notes: { 500: 1, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0 }, 500: 1, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0 },
      { date: getDateStr(0), time: '11:20 AM', note: 'Salary', total: 1500, notes: { 500: 2, 200: 2, 100: 1, 50: 0, 20: 0, 10: 0 }, 500: 2, 200: 2, 100: 1, 50: 0, 20: 0, 10: 0 },
    ];

    await Transaction.insertMany(dummyTransactions);

    const dummyGoals = [];

    await Goal.insertMany(dummyGoals);

    res.status(200).json({ message: 'PiggyLove seeded with magical demo data for Anna Ben Byju!' });
  } catch (error) {
    next(error);
  }
};
