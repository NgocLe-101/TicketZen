const db = require("../dbs/db");
const bcrypt = require("bcrypt");
const { performance } = require("perf_hooks");
class UserModel {
  static createUser = async ({ username, email, password }) => {
    console.log("Creating user");
    const startTimer = performance.now();
    const trx = await db.transaction();
    try {
      const [hashedPassword, verification_token] = await Promise.all([
        bcrypt.hash(password, 10),
        bcrypt.hash(email, 10),
      ]);
      const endTimer = performance.now();
      console.log(`Hashing took ${(endTimer - startTimer).toFixed(2)} ms`);
      const userInsertStart = performance.now();
      const [data] = await trx("users")
        .insert({
          username,
          email,
          password: hashedPassword,
        })
        .returning("id");
      const userInsertEnd = performance.now();
      console.log(
        `User insert took ${(userInsertEnd - userInsertStart).toFixed(2)} ms`
      );
      const tokenInsertStart = performance.now();
      await trx("verification_tokens").insert({
        user_id: data.id,
        token: verification_token,
        expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      });
      const tokenInsertEnd = performance.now();
      console.log(
        `Token insert took ${(tokenInsertEnd - tokenInsertStart).toFixed(2)} ms`
      );

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

  static findOneWithUsernameOrEmail = async (username, email) => {
    try {
      return await db("users")
        .where("username", username)
        .orWhere("email", email)
        .first();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static findUserById = async (id) => {
    try {
      const result = await db.raw(
        `
        SELECT id, username, email, state
        FROM users
        WHERE id = ${id}
        `
      );
      const user = result.rows[0];
      return user;
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
}

module.exports = UserModel;
