const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userModel = require('../models/user.model');

const router = express.Router();

class AccessService {
    static signUp = async ({ username, email, password }) => {
        try {
            // Check username exists
            const existingUser = await userModel.findOne({ username });
            if (existingUser) {
                return {
                    code: '20001',
                    message: 'Username already exists',
                    status: 'error'
                };
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newAccount = await userModel.createUser({
                username,
                email,
                password: passwordHash,
            });

            if (newAccount) {
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096
                });

                console.log("Keys generated:", { privateKey, publicKey });

                return { code: '20000', message: 'User registered successfully', userId: newAccount };
            }

        } catch (error) {
            return {
                code: '20002',
                message: error.message,
                status: 'error'
            };
        }
    }
}

// Controller for handling registration requests
class AccessController {
    static signUp = async (req, res, next) => {
        try {
            console.log(`[P]::signUp::`, req.body);
            const { username, email, password } = req.body;
            const result = await AccessService.signUp({ username, email, password });

            // Send appropriate response
            if (result.status === 'error') {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                code: '20000',
                message: 'User registered successfully',
                metadata: { userId: result.userId }
            });
        } catch (error) {
            next(error);
        }
    }
}

// Route definition for user registration
router.post('/register', AccessController.signUp);

module.exports = router;
