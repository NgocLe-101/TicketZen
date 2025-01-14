import CartModel from "../cart/cart.model.js";
import OrderModel from "../order/order.model.js";
import ProductModel from "../product/product.model.js";

const getCartPage = async (req, res) => {
  console.log(req.session.cart);
  const cartId = req.session.cart.id;
  try {
    const cartItems = await CartModel.getCartItems(cartId);
    res.render("cart", { cartItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const cartId = req.session.cart.id;
    const { id } = req.params;
    const { quantity = 1 } = req.body;
    const movie = await ProductModel.getProductById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    const price = movie.price;

    const item = await CartModel.addCartItem(cartId, id, quantity, price);
    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const cartId = req.session.cart.id;
    const { id } = req.params;
    const { quantity } = req.body;
    const movie = await ProductModel.getProductById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const updatedCart = await CartModel.updateItem(cartId, id, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cartId = req.session.cart.id;
    const { id } = req.params;

    const updatedCart = await CartModel.removeItem(cartId, id);
    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkout = async (req, res) => {
  try {
    const order = await OrderModel.createFromCart(req.user.id);
    await CartModel.clear(req.user.id);
    res.json({ success: true, orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCheckoutWithSeats = async (req, res) => {
  try {
    const cartId = req.session.cart.id;
    const cartItems = await CartModel.getCartItems(cartId);
    const movieIds = cartItems.map(item => item.movie_id);
    const showtimes = await ShowtimeModel.getShowtimesByMovieIds(movieIds);
    const seatsByShowtime = {};
    for (const showtime of showtimes) {
      seatsByShowtime[showtime.id] = await SeatModel.getSeatsByShowtimeId(showtime.screen_id);
    }

    res.render('checkout', { cartItems, showtimes, seatsByShowtime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


export default {
  getCartPage,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkout,
  getCheckoutWithSeats,
};
