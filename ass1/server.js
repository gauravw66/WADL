const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to store user data
const USERS_FILE = "users.json";

// Read users from file
const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE);
    return data.length ? JSON.parse(data) : [];
};

// Write users to file
const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Signup API Endpoint
app.post("/signup", (req, res) => {
    const { name, email, password, phone, dob } = req.body;

    if (!name || !email || !password || !phone || !dob) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const users = readUsers();

    // Check if email already exists
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ message: "Email already exists!" });
    }

    // Store new user
    const newUser = { name, email, password, phone, dob };
    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: "Signup successful!" });
});

// Get All Users (For testing)
app.get("/users", (req, res) => {
    res.json(readUsers());
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
