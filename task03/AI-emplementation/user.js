import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Schema Definition with strict validation
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: [true, 'Username is mandatory'], 
        unique: true,
        lowercase: true,
        trim: true 
    },
    password: { 
        type: String, 
        required: [true, 'Password is mandatory'] 
    }
});

const UserDB = mongoose.model('User', userSchema);

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    /**
     * AI Logic: Hashes password before persistence
     */
    async register() {
        try {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            
            const newUser = new UserDB({
                username: this.username,
                password: hashedPassword
            });
            return await newUser.save();
        } catch (err) {
            throw new Error(`Registration failed: ${err.message}`);
        }
    }

    /**
     * AI Logic: Uses bcrypt.compare for secure verification
     */
    async login() {
        try {
            const record = await UserDB.findOne({ username: this.username });
            if (!record) return null;

            const isMatch = await bcrypt.compare(this.password, record.password);
            return isMatch ? record : null;
        } catch (err) {
            throw new Error('Authentication process failed');
        }
    }
}

export default User;