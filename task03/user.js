const mongoose = require('mongoose');

// Assuming the model is defined or accessible
class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    async register(UserModel) {
        const newUser = new UserModel({
            username: this.username,
            password: this.password
        });
        return await newUser.save();
    }

    async login(UserModel) {
        const foundUser = await UserModel.findOne({ username: this.username });
        if (foundUser && foundUser.password === this.password) {
            return foundUser;
        }
        return null;
    }
}

module.exports = User;