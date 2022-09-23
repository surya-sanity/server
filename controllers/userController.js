const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { initCart } = require("./cartController");
const { initWallet } = require("./walletController");
const { Op } = require("sequelize");

const User = db.users;

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ where: { email: email } });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  if (user) {
    //create cart and wallet for the newly registered user

    await initCart(user.id);
    await initWallet(user.id);
    res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user.email),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ where: { email: email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user.email),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc    Get user data
// @route   GET /api/users/current
// @access  Private
const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc    Get All Users data
// @route   GET /api/users/all
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.findAll({
    where: { id: { [Op.ne]: req.user.id } },
  });

  res.status(200).json(allUsers);
});

// @desc    Delete userById
// @route   GET /api/users/deleteUser/:id
// @access  Admin
const deleteUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const userExists = await User.findOne({ where: { id } });

  if (!userExists) {
    res.status(400);
    throw new Error("User doesn't exist !");
  }

  await User.destroy({
    where: { id: id },
  })
    .then(() => {
      res.status(200).json({ message: "Deleted user !" });
    })
    .catch((err) => {
      res.status(400);
      throw new Error("Cannot delete that user ");
    });
});

// @desc    Delete all Users data
// @route   GET /api/users/deleteAll
// @access  Admin
const deleteAllUsers = asyncHandler(async (req, res) => {
  await User.destroy({
    where: { id: { [Op.ne]: req.user.id } },
  })
    .then(() => {
      res.status(200).json({ message: "Deleted all users !" });
    })
    .catch((err) => {
      res.status(400);
      throw new Error("Cannot delete all users ");
    });
});

// Generate JWT
const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  deleteAllUsers,
  deleteUserById,
};
