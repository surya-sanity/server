const walletController = require("../controllers/walletController.js");
const { protect } = require("../middleware/authMiddleware");

const walletRouter = require("express").Router();

walletRouter.post("/create", protect, walletController.createWallet);
walletRouter.put("/update", protect, walletController.updateWalletBalance);
walletRouter.get("/current", protect, walletController.getWallet);

module.exports = walletRouter;
