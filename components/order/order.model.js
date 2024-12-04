import db from "../../dbs/db.js";

const createFromCart = async (userId) => {
  // Start transaction
  const trx = await db.transaction();

  try {
    // Get cart items
    const cartItems = await trx("cart_items")
      .join("products", "cart_items.product_id", "=", "products.id")
      .where("cart_items.user_id", userId)
      .select(
        "products.id as product_id",
        "products.price",
        "cart_items.quantity"
      );

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Calculate total
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const [orderId] = await trx("orders").insert({
      user_id: userId,
      total_amount: totalAmount,
      status: "pending",
    });

    // Create order items
    const orderItems = cartItems.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    await trx("order_items").insert(orderItems);

    // Commit transaction
    await trx.commit();

    return {
      id: orderId,
      total_amount: totalAmount,
      items: orderItems,
    };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

const getUserOrders = async (userId) => {
  return await db("orders")
    .where("user_id", userId)
    .orderBy("created_at", "desc");
};

const getOrderDetails = async (orderId, userId) => {
  const order = await db("orders")
    .where({ id: orderId, user_id: userId })
    .first();

  if (!order) return null;

  const items = await db("order_items")
    .join("products", "order_items.product_id", "=", "products.id")
    .where("order_items.order_id", orderId)
    .select(
      "products.title",
      "products.image_url",
      "order_items.quantity",
      "order_items.price"
    );

  return {
    ...order,
    items,
  };
};

export default {
  createFromCart,
  getUserOrders,
  getOrderDetails,
};
