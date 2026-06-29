const Goal = require('../models/Goal');

// @desc    Get all goals
// @route   GET /api/goals
// @access  Public
exports.getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find().sort({ completed: 1, createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Public
exports.createGoal = async (req, res, next) => {
  try {
    const { title, targetAmount } = req.body;
    const goal = await Goal.create({
      title,
      targetAmount,
      savedAmount: req.body.savedAmount || 0,
      completed: (req.body.savedAmount || 0) >= targetAmount
    });
    res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Public
exports.updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    if (req.body.title !== undefined) goal.title = req.body.title;
    if (req.body.targetAmount !== undefined) goal.targetAmount = Number(req.body.targetAmount);
    if (req.body.savedAmount !== undefined) goal.savedAmount = Number(req.body.savedAmount);
    
    goal.completed = goal.savedAmount >= goal.targetAmount;
    await goal.save();
    
    res.status(200).json(goal);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Public
exports.deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(200).json({ message: 'Goal removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all goals
// @route   DELETE /api/goals
// @access  Public
exports.deleteAllGoals = async (req, res, next) => {
  try {
    await Goal.deleteMany({});
    res.status(200).json({ message: 'All goals removed successfully' });
  } catch (error) {
    next(error);
  }
};
