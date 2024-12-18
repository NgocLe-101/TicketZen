import cartModel from "../../components/cart/cart.model.js";

const getOrCreateCart = async (req, res, next) => {
  let cart;
  // if user is logged in, get cart by user id
  if (req.user) {
    cart = await cartModel.getCartByUserId(req.user.id);
  }
  // if user is not logged in, get cart by session id
  if (!cart) {
    cart = await cartModel.getCartBySessionId(req.sessionID);
  }
  // if cart does not exist, create a new cart
  if (!cart) {
    cart = await cartModel.createCart(req.user?.id, req.sessionID);
  }
  req.session.cart = cart;
  next();
};

const ensureHasCart = (req, res, next) => {
  if (!req.session.cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  next();
};
export { getOrCreateCart, ensureHasCart };
