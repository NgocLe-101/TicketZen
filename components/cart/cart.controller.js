import CartModel from "../cart/cart.model.js";
import OrderModel from "../order/order.model.js";

const getCartPage = async (req, res) => {
  try {
    const cartItems = await CartModel.getCartItems(req.user.id);
    res.render("cart", { cartItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.body;
    await CartModel.addCartItem(req.user.id, id, quantity);
    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const updatedCart = await CartModel.updateItem(req.user.id, id, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCart = await CartModel.removeItem(req.user.id, id);
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

export default {
  getCartPage,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkout,
};
