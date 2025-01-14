import db from "../../dbs/db.js";

const getCartByUserId = async (userId) => {
  return await db("carts").where({ user_id: userId }).first();
};

const getCartItems = async (cartId) => {
  return await db("cart_items")
    .where({ cart_id: cartId })
    .join("products", "cart_items.movie_id", "products.id")
    .select(
      "cart_items.*",
      "products.title",
      // "products.image_url",
      "products.price"
    );
};

const addCartItem = async (cartID, productId, quantity, price) => {
  const existingItem = await db("cart_items")
    .where({ cart_id: cartID, movie_id: productId })
    .first();

  if (existingItem) {
    return await db("cart_items")
      .where({ cart_id: cartID, movie_id: productId })
      .update({
        quantity: db.raw("quantity + ?", [quantity]),
        updated_at: db.fn.now(),
      });
  }

  return await db("cart_items").insert({
    cart_id: cartID,
    movie_id: productId,
    quantity,
    price,
  });
};

const updateItem = async (cartId, cartItemId, quantity) => {
  await db("cart_items")
    .where({ id: cartItemId, cart_id: cartId })
    .update({ quantity, updated_at: db.fn.now() });

  return getCartItems(cartId);
};

const removeItem = async (cartId, cartItemId) => {
  await db("cart_items").where({ id: cartItemId, cart_id: cartId }).del();
  return getCartItems(cartId);
};

// const clear = async (cartId) => {
//   return await db("cart_items").where({ user_id: userId }).del();
// };

const getTotal = async (cartId) => {
  const result = await db("cart_items")
    .where({ cart_id: cartId })
    .sum("price as total")
    .first();
  return result.total || 0;
};

const getCartBySessionId = async (sessionId) => {
  return await db("carts").where({ session_id: sessionId }).first();
};

const createCart = async (userId, sessionId) => {
  const cart = await db("carts")
    .insert({
      user_id: userId,
      session_id: sessionId,
    })
    .returning("*");

  return cart[0];
};

const mergeCartOnLogin = async (userId, sessionId) => {
  const sessionCart = await getCartBySessionId(sessionId);
  const userCart = await getCartByUserId(userId);

  if (!sessionCart && !userCart) {
    return;
  }
  // if user has no cart (first time login)
  if (sessionCart && !userCart) {
    return await db("carts")
      .where({ session_id: sessionId })
      .update({ user_id: userId });
  }
  // if both user and session have cart, merge them
  if (sessionCart && userCart) {
    const [sessionCartItems, userCartItems] = await Promise.all([
      db("cart_items").where({ cart_id: sessionCart.id }),
      db("cart_items").where({ cart_id: userCart.id }),
    ]);

    for (const item of sessionCartItems) {
      const existingItem = userCartItems.find(
        (i) => i.movie_id === item.movie_id
      );

      if (existingItem) {
        await db("cart_items")
          .where({ id: existingItem.id, cart_id: userCart.id })
          .update({ quantity: db.raw("quantity + ?", [item.quantity]) });
      } else {
        await db("cart_items").insert({
          cart_id: userCart.id,
          movie_id: item.movie_id,
          quantity: item.quantity,
          price: item.price,
        });
      }
    }
    return await db("carts").where({ session_id: sessionId }).del();
  }
};

export default {
  getCartItems,
  addCartItem,
  updateItem,
  removeItem,
  // clear,
  getTotal,
  getCartByUserId,
  getCartBySessionId,
  createCart,
  mergeCartOnLogin,
};
