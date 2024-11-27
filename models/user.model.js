const db = require("../dbs/db");
const bcrypt = require("bcrypt");

class UserModel {
  static createUser = async ({ username, email, password }) => {
    const trx = await db.transaction();
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verification_token = await bcrypt.hash(email, 20);

      const [data] = await trx("users")
        .insert({
          username,
          email,
          password: hashedPassword,
        })
        .returning("id");

      await trx("verification_tokens").insert({
        user_id: data.id,
        token: verification_token,
        expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      });

      await trx.commit();
      return { id: data.id, username, email, verification_token };
    } catch (error) {
      await trx.rollback();
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

  static verifyUser = async (token) => {
    try {
      const user = await db("users")
        .join("verification_tokens", "users.id", "verification_tokens.user_id")
        .where("verification_tokens.token", token)
        .first();

      if (!user) {
        throw new Error("Invalid token");
      }

      const isExpired = new Date() > new Date(user.expires);
      if (isExpired) {
        throw new Error("Token expired");
      }

      await Promise.all([
        db("verification_tokens").where("user_id", user.user_id).del(),
        db("users").where("id", user.user_id).update({ state: "verified" }),
      ]);

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static getUserByEmail = async (email) => {
    try {
      return await db("users").where({ email }).first();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static saveVerificationCode = async (userId, verificationCode) => {
    try {
      await db("verification_codes").insert({
        user_id: userId,
        verification_code: verificationCode,
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static getVerificationCode = async (userId) => {
    try {
      return await db("verification_codes")
        .where({ user_id: userId })
        .where("expires", ">", new Date())
        .first();
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

module.exports = UserModel;
