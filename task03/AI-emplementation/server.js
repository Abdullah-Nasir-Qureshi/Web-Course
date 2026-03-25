import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import User from './user.js';

const app = express();
const PORT = 3000;

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/studentDB')
    .then(() => console.log('🚀 AI Version: Securely connected to MongoDB'))
    .catch(err => console.error('Database Connection Error:', err));

// Professional Middleware Setup
app.use(express.json());
app.use(session({
    name: 'sessionID',
    secret: 'AI_VERSION_SUPER_SECRET_KEY_99',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // 1 Hour
        sameSite: 'lax'
    }
}));

// Specialized Authentication Middleware
const requireAuth = (req, res, next) => {
    if (req.session.user) return next();
    res.status(403).json({ success: false, message: 'Unauthorized Access' });
};

// --- ROUTES ---

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const handler = new User(username, password);
        await handler.register();
        res.status(201).json({ status: 'Success', message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ status: 'Error', message: err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const handler = new User(username, password);
        const loggedInUser = await handler.login();

        if (loggedInUser) {
            req.session.user = loggedInUser.username;
            res.json({ status: 'Success', message: 'Login successful' });
        } else {
            res.status(401).json({ status: 'Fail', message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
    }
});

app.get('/dashboard', requireAuth, (req, res) => {
    res.json({ 
        message: `Welcome ${req.session.user}`, 
        timestamp: new Date().toISOString() 
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Logout failed');
        res.clearCookie('sessionID');
        res.send('Logout successful');
    });
});

app.listen(PORT, () => {
    console.log(`Server executing at http://localhost:${PORT}`);
});