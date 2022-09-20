const transactionController = require("../controllers/transactionController.js");
const { protect } = require("../middleware/authMiddleware");

const transactionRouter = require("express").Router();

transactionRouter.get(
  "/current",
  protect,
  transactionController.getAllTransactions
);

module.exports = transactionRouter;
