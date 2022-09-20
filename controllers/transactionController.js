const db = require("../models");
const asyncHandler = require("express-async-handler");

const Transaction = db.transactions;

// @desc    GetAll transactions for currentUser
// @route   GET /api/transactions/current
// @access  users
const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.findAll({
    where: { userId: req.user.id },
    order: [["createdAt", "DESC"]],
  });

  res.status(200).send(transactions);
});

module.exports = {
  getAllTransactions,
};
