const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/studentDB')
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const UserModel = mongoose.model('User', userSchema);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));

// Middleware to check authentication
const auth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('Please login first');
    }
};

app.get('/dashboard', auth, (req, res) => {
    res.send(`Welcome ${req.session.user}`);
});


app.get('/', (req, res) => {
    res.send('Server is running');
});

const User = require('./user');

app.post('/register', async (req, res) => {
    try {
        const userObj = new User(req.body.username, req.body.password);
        await userObj.register(UserModel);
        res.send('User registered successfully');
    } catch (error) {
        res.status(400).send('Registration failed');
    }
});

app.post('/login', async (req, res) => {
    const userObj = new User(req.body.username, req.body.password);
    const loggedInUser = await userObj.login(UserModel);

    if (loggedInUser) {
        req.session.user = loggedInUser.username;
        res.send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});