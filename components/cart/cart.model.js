import db from "../../dbs/db";

const getCartItems = async (userId) => {
  return await db("cart_items")
    .join("products", "cart_items.movie_id", "=", "products.id")
    .where("cart_items.user_id", userId)
    .select(
      "cart_items.id",
      "products.title",
      "products.price",
      "products.image_url",
      "cart_items.quantity"
    );
};

const addCartItem = async (userId, productId, quantity) => {
  const existingItem = await db("cart_items")
    .where({ user_id: userId, movie_id: productId })
    .first();

  if (existingItem) {
    return await db("cart_items")
      .where({ user_id: userId, movie_id: productId })
      .update({
        quantity: db.raw("quantity + ?", [quantity]),
        updated_at: db.fn.now(),
      });
  }

  return await db("cart_items").insert({
    user_id: userId,
    movie_id: productId,
    quantity,
  });
};

const updateItem = async (userId, cartItemId, quantity) => {
  await db("cart_items")
    .where({ id: cartItemId, user_id: userId })
    .update({ quantity, updated_at: db.fn.now() });

  return getCartItems(userId);
};

const removeItem = async (userId, cartItemId) => {
  await db("cart_items")
    .where({ id: cartItemId, user_id: userId })
    .del();
  return getCartItems(userId);
};

const clear = async (userId) => {
  return await db("cart_items").where({ user_id: userId }).del();
};

const getTotal = async (userId) => {
  const result = await db("cart_items")
    .join("products", "cart_items.movie_id", "=", "products.id")
    .where("cart_items.user_id", userId)
    .sum(db.raw("products.price * cart_items.quantity as total"))
    .first();
  return result.total || 0;
};

export default {
  getCartItems,
  addCartItem,
  updateItem,
  removeItem,
  clear,
  getTotal,
};
