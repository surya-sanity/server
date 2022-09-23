const db = require("../models");
const asyncHandler = require("express-async-handler");
const { updateWalletHelper } = require("./walletController");

const UserBook = db.userBooks;
const Book = db.books;

// @desc    Create userBook
// @route   POST /api/userBook/create
// @access  users
const addUserBook = asyncHandler(async (req, res) => {
  const { bookId, noOfDays } = req.body;

  if (!bookId || !noOfDays) {
    res.status(400);
    throw new Error("Please provide all details");
  }

  if (noOfDays <= 0) {
    res.status(400);
    throw new Error("Renting days should be atleast 1");
  }

  const alreadyExists = await UserBook.findOne({
    where: { bookId: bookId, userId: req.user.id },
  });

  if (alreadyExists) {
    res.status(400);
    throw new Error("Already in your books");
  }

  const bookToRent = await Book.findOne({ where: { id: bookId } });

  if (!bookToRent) {
    res.status(400);
    throw new Error("Book not found !");
  }

  const amountToBeDeducted = bookToRent.pricePerDay * parseInt(noOfDays);

  const addDays = (days) => {
    var result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  };

  const startDate = new Date().toISOString();

  const endDate = addDays(noOfDays).toISOString();

  await UserBook.create({
    startDate,
    userId: req.user.id,
    endDate,
    bookId,
  });

  try {
    await updateWalletHelper({
      userId: req.user.id,
      amount: amountToBeDeducted,
      mode: "DEBIT",
      res,
    });
  } catch (err) {
    return err;
  }
});

// @desc    Get userBooks for currentUser
// @route   GET /api/userBook/getAll
// @access  users
const getAllUserBooks = asyncHandler(async (req, res) => {
  const userBooks = await UserBook.findAll({ where: { userId: req.user.id } });

  res.status(200).send(userBooks);
});

// @desc    Delete userBook for currentUser by id
// @route   DELETE /api/userBook/deleteOne/:id
// @access  users
const deleteUserBookById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("bookId cannot be empty !");
  }

  const bookExists = await UserBook.findOne({ where: { id: id } });

  if (!bookExists) {
    res.status(400);
    throw new Error("Book not found");
  }

  await UserBook.destroy({ where: { id: id } });

  res.status(200).send({ message: "Deleted Successfully !" });
});

// @desc    Get userBooks for Admin
// @route   GET /api/userBook/admin/all
// @access  Admin
const getAllUserBooksAdmin = asyncHandler(async (req, res) => {
  const userBooks = await UserBook.findAll();

  res.status(200).send(userBooks);
});

// @desc    Delete all user books by Admin
// @route   DELETE /api/userBook/deleteAll
// @access  Admin
const deleteAllUserBooks = asyncHandler(async (req, res) => {
  await UserBook.destroy({ where: {}, truncate: true });

  res.status(200).send({ message: "Deleted Successfully !" });
});

module.exports = {
  addUserBook,
  getAllUserBooks,
  deleteUserBookById,
  getAllUserBooksAdmin,
  deleteAllUserBooks,
};
