const db = require("../dbs/db");
const bcrypt = require("bcrypt");

class UserModel {
  static createUser = async ({ username, email, password }) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = await db("users")
        .insert({
          username,
          email,
          password: hashedPassword,
        })
        .returning("id");
      return { id, username, email };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static findOne = async (condition) => {
    try {
      return await db("users").where(condition).first();
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

module.exports = UserModel;
