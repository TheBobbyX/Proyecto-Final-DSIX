const { body, param, validationResult } = require('express-validator');

const { UserModel } = require('../models/User');


module.exports.validators = {
    signupUser: [
        body('name', 'Name is required').exists(),
        body('email', 'Email is required').exists(),
        body('password', 'Password is required').exists(),
        body('age', 'Age is required').exists(),
    ],
    loginUser: [
        body('email', 'Email is required').exists(),
        body('password', 'Password is required').exists(),
    ]
};

module.exports.controllers = {
    signupUser: async (req, res, next) => {
        try {
            // Evaluate validations
            const errors = validationResult(req);
            if (!errors.isEmpty()) { return res.json(errors); }
            const { name, email, password, age } = req.body;

            // Save in database
            const userInstance = UserModel({ name, email, password, age });
            await userInstance.validate();
            const user = await userInstance.save();
            res.json({ data: user, model: 'user' });
        } catch (error) {
            res.json({ message: error.message });
        }
    },
    loginUser: async (req, res, next) => {
        try {
            // Evaluate validations
            const errors = validationResult(req);
            if (!errors.isEmpty()) { return res.json(errors); }
            const { email, password } = req.body;

            // Login the user
            const user = await UserModel.findOne({ email });
            if (!user) { throw new Error('Either email or password does not exists.') }

            const isValid = await user.validatePassword(password);
            if (!isValid) { throw new Error('Either email or password does not exists.') }

            const token = await user.getAccessToken();
            return res.json({ auth: true , token: token });
        } catch (error) {
            res.json({ auth: false ,message: error.message });
        }
    }
};