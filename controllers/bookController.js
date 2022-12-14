const db = require("../models");
const asyncHandler = require("express-async-handler");
const { sequelize } = require("../models");
const { Op, or } = require("sequelize");

const Book = db.books;

//1. Create Book
const addBook = asyncHandler(async (req, res) => {
  if (!Object.values(req.body).length > 0) {
    res.status(400);
    throw new Error({ message: "Request cannot be empty !" });
  }

  let bookInfo = {
    title: req.body?.title,
    pageCount: req.body?.pageCount,
    publishedDate: req.body?.publishedDate,
    thumbnailUrl: req.body?.thumbnailUrl,
    shortDescription: req.body?.shortDescription,
    longDescription: req.body?.longDescription,
    published: req.body.published ? req.body?.published : false,
    longDescription: req.body?.longDescription,
    author: req.body?.author,
    genre: req.body?.genre,
    pricePerDay: req.body?.pricePerDay,
    price: req.body?.price,
  };

  const book = await Book.create(bookInfo);

  res.status(200).send(book);
});

//2. Get All Books
const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.findAll();

  res.status(200).send(books);
});

//3. Get Book by id
const getBookById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const book = await Book.findOne({ where: { id: id } });

  if (!book) {
    res.status(400);
    throw new Error(`Book not found for id = ${id}`);
  }

  res.status(200).send(book);
});

//4. Update Book by Id
const updateBookById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  const bookFound = await Book.findOne({ where: { id: id } });

  if (!bookFound) {
    res.status(400);
    throw new Error(`Book not found ${id}`);
  }

  const bookUpdated = await Book.update(updateData, { where: { id: id } });

  res.status(200).send(bookUpdated);
});

//5. Delete Book by Id
const deleteBook = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const bookFound = await Book.findOne({ where: { id: id } });

  if (!bookFound) {
    res.status(400);
    throw new Error(`Book not found ${id}`);
  }

  await Book.destroy({ where: { id: id } });

  return res.status(200).send({ message: true });
});

//6. Get books by title, genre, author
const getBooksByTitle = asyncHandler(async (req, res) => {
  const { term } = req.body;

  if (!term) {
    res.status(400);
    throw new Error("Search term cannot be Empty !");
  }

  const books = await Book.findAll({
    where: {
      [Op.or]: [
        sequelize.where(
          sequelize.fn("LOWER", sequelize.col("title")),
          "LIKE",
          "%" + term + "%"
        ),
        sequelize.where(
          sequelize.fn("LOWER", sequelize.col("genre")),
          "LIKE",
          "%" + term + "%"
        ),
        sequelize.where(
          sequelize.fn("LOWER", sequelize.col("author")),
          "LIKE",
          "%" + term + "%"
        ),
      ],
    },
  });

  res.status(200).send(books);
});

//7. Create bulk books
const createBulkBooks = asyncHandler(async (req, res) => {
  const { books } = req.body;

  if (books.length === 0) {
    res.status(400);
    throw new Error("books cannot be empty");
  }

  const createdBooks = await Book.bulkCreate(books, { returning: true });

  res.status(200).send(createdBooks);
});

//7. Delete all books at once
const deleteAllBooks = asyncHandler(async (req, res) => {
  await Book.destroy({
    where: {},
    truncate: true,
  })
    .then(() => {
      res.status(200).send({ message: "All books deleted successfully !" });
    })
    .catch((err) => {
      res.status(400);
      throw new Error(err);
    });
});

module.exports = {
  addBook,
  getAllBooks,
  updateBookById,
  getBookById,
  deleteBook,
  getBooksByTitle,
  createBulkBooks,
  deleteAllBooks,
};
