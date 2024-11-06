const db = require('../dbs/db');

class UserModel {
    static createUser = async ({ username, email, password }) => {
        try {
            const [id] = await db('users').insert({ username, email, password });
            return id;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static findOne = async (condition) => {
        try {
            return await db('users').where(condition).first();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = UserModel;
