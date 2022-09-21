const db = require("../models");
const asyncHandler = require("express-async-handler");

const Wallet = db.wallets;
const Transaction = db.transactions;

// @desc    Create wallet for new user
// @route   POST /api/wallet/create
// @access  users
const createWallet = asyncHandler(async (req, res) => {
  return await initWallet(req.user.id)
    .then((wallet) => {
      return res.status(200).send(wallet);
    })
    .catch((err) => {
      res.status(400);
      throw new Error(`Cannot create wallet ${err}`);
    });
});

// @desc    Update walletbalance
// @route   PUT /api/wallet/update
// @access  users
const updateWalletBalance = asyncHandler(async (req, res) => {
  const { amount, mode } = req.body;

  return await updateWalletHelper({ amount, mode, userId: req.user.id, res });
});

// @desc    Get wallet of currentUser
// @route   GET /api/wallet/current
// @access  users
const getWallet = asyncHandler(async (req, res) => {
  const walletExists = await Wallet.findOne({ where: { userId: req.user.id } });

  if (!walletExists) {
    res.status(400);
    throw new Error(`No wallet found for user ${req.user.id}`);
  }

  return await Wallet.findByPk(walletExists.userId)
    .then((wallet) => {
      return res.status(200).send(wallet);
    })
    .catch((err) => {
      res.status(500);
      throw new Error(" Error while finding wallet: ", err);
    });
});

//helper function
const initWallet = async (userId) => {
  const walletExists = await Wallet.findOne({ where: { userId } });

  if (!walletExists) {
    const walletCreated = await Wallet.create({
      userId,
      walletBalance: 6969,
    });

    return walletCreated;
  }

  return walletExists;
};

const updateWalletHelper = async ({ userId, amount, mode, res }) => {
  const walletExists = await Wallet.findOne({ where: { userId: userId } });

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error(`Topup amount should not be empty or Zero`);
  }

  if (!mode || !mode === ("DEBIT" || "CREDIT")) {
    res.status(400);
    throw new Error(
      `Topup mode should be either DEBIT/CREDIT and should not be empty `
    );
  }

  if (!walletExists) {
    res.status(400);
    throw new Error(`Cannot find wallet for the user ${userId}`);
  }

  if (
    mode === "DEBIT" &&
    parseFloat(walletExists.walletBalance) - parseFloat(amount) < 0
  ) {
    res.status(403);
    return res.send({ message: "Not enough balance" });
  }

  try {
    await Wallet.update(
      {
        walletBalance:
          mode === "CREDIT"
            ? parseFloat(walletExists.walletBalance) + parseFloat(amount)
            : parseFloat(walletExists.walletBalance) - parseFloat(amount),
      },
      { where: { userId: userId } }
    );

    await Transaction.create({ userId, mode, amount });
  } catch (err) {
    res.status(400);
    throw new Error(`Wallet balance update Error `);
  }

  const updatedWallet = await Wallet.findOne({
    where: { userId: userId },
  });

  return res.status(200).send(updatedWallet);
};

module.exports = {
  createWallet,
  updateWalletBalance,
  initWallet,
  updateWalletHelper,
  getWallet,
};
