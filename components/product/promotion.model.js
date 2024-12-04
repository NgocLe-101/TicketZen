import db from "../../dbs/db.js";

const findOne = async (condition) => {
  try {
    return await db("promotions").where(condition).first();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPromotionById = async (id) => {
  try {
    return await db("promotions").where({ id }).first();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllPromotions = async (limit = null) => {
  try {
    if (limit) {
      return await db("promotions").select("*").limit(limit);
    }
    return await db("promotions").select("*");
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
  findOne,
  getPromotionById,
  getAllPromotions,
};
