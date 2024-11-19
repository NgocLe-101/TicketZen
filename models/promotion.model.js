const db = require("../dbs/db");

class PromotionModel {
    static findOne = async (condition) => {
        try {
            return await db("promotions").where(condition).first();
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static getPromotionById = async (id) => {
        try {
            return await db("promotions").where({ id }).first();
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static getAllPromotions = async (limit = null) => {
        try {
            if (limit) {
                return await db("promotions").select("*").limit(limit);
            }
            return await db("promotions").select("*");
        } catch (error) {
            throw new Error(error.message);
        }
    };
}

module.exports = PromotionModel;