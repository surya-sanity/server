const bookController = require("../controllers/bookController.js");
const { protect, adminProtect } = require("../middleware/authMiddleware");

const bookRouter = require("express").Router();

bookRouter.get("/allBooks", protect, bookController.getAllBooks);

bookRouter.get("/id/:id", protect, bookController.getBookById);

bookRouter.post("/filter/", protect, bookController.getBooksByTitle);

bookRouter.post("/addBook", adminProtect, bookController.addBook);

bookRouter.put("/:id", adminProtect, bookController.updateBookById);

bookRouter.delete("/:id", adminProtect, bookController.deleteBook);

module.exports = bookRouter;
