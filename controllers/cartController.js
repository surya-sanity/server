const db = require("../models");
const asyncHandler = require("express-async-handler");

const Cart = db.carts;
const CartItem = db.cartItems;
const Book = db.books;

// @desc    Create cart for new user
// @route   POST /api/cart/createCart
// @access  users
const createCart = asyncHandler(async (req, res) => {
  return await initCart(req.user.id)
    .then((cart) => {
      return res.status(200).send(cart);
    })
    .catch((err) => {
      res.status(400);
      throw new Error(`Cannot create cart ${err}`);
    });
});

// @desc    Add item to cart
// @route   PUT /api/cart/addItem
// @access  users
const addItemToCart = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const bookExists = await Book.findOne({ where: { id: id } });
  const cart = await Cart.findOne({ where: { userId: req.user.id } });

  if (!bookExists) {
    res.status(400);
    throw new Error(`Book cannot be found for id ${id}`);
  }

  const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });

  const itemAlreadyInCart = cartItems.find((item) => item.itemId === id);

  if (itemAlreadyInCart) {
    res.status(400);
    throw new Error("Item already in Cart");
  }

  const cartItem = await CartItem.create({ itemId: id, cartId: cart.id });

  return res.status(200).send(cartItem);
});

// @desc    Remove item to cart
// @route   DELETE /api/cart/removeItem
// @access  users
const removeItemFromCart = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const cart = await Cart.findOne({ where: { userId: req.user.id } });
  const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });

  const itemInCart = cartItems.find((item) => item.itemId === id);

  if (!itemInCart) {
    res.status(400);
    throw new Error("Item Not in Cart");
  }

  await CartItem.destroy({ where: { itemId: id, cartId: cart.id } });

  return res
    .status(200)
    .send({ message: `Removed item ${id} from ${cart.id}` });
});

// @desc    Clear All items from cart
// @route   DELETE /api/cart/clear
// @access  users
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ where: { userId: req.user.id } });

  await CartItem.destroy({ where: { cartId: cart.id } });

  return res.status(200).send(`Cart cleared for user ${req.user.id}`);
});

// @desc    Get Cart by currentUser
// @route   GET /api/cart/getCart
// @access  users
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ where: { userId: req.user.id } });

  return await Cart.findByPk(cart.id, { include: ["items"] })
    .then((cart) => {
      return res.status(200).send(cart);
    })
    .catch((err) => {
      res.status(500);
      throw new Error(" Error while finding cart: ", err);
    });
});

const initCart = async (userId) => {
  const cartExists = await Cart.findOne({ where: { userId } });

  if (!cartExists) {
    const cart = await Cart.create({ userId });

    return cart;
  }

  return cartExists;
};

module.exports = {
  createCart,
  addItemToCart,
  getCart,
  removeItemFromCart,
  clearCart,
  initCart,
};
