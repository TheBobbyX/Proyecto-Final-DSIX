const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');

const SALT_FACTOR = 10;

const UserSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, 'The email is invalid.'],
        createIndexes: { unique: true },
        unique: true
    },
    password: { type: String, required: true },
    age: { type: Number, default: 16 },
    active: { type: Boolean, default: true },
});

UserSchema.pre('save', async function save(next) {
    try {
        const salt = await bcrypt.genSalt(SALT_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (error) {
        return next(error);
    }
});

UserSchema.methods.validatePassword = async function validationPassword(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.getAccessToken = async function getAccessToken() {
    return jwt.sign({ name: this.name, email: this.email }, process.env.JWT_TOKEN_SECRET, { expiresIn: 60*60*1/*Una hora*/});
}

const UserModel = mongoose.model('User', UserSchema);

module.exports = {
    UserModel
}