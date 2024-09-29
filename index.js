const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const port = 8000;

// Configure CORS
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
}));

const dataFilePath = path.join(__dirname, "sample.json");

// Read users from file
const readUsersFromFile = () => {
    try {
        const data = fs.readFileSync(dataFilePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading file:", error);
        return [];
    }
};

// Write users to file
const writeUsersToFile = (users, res) => {
    fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Internal Server Error');
        }
        return res.json(users);
    });
};

// Display all users
app.get("/users", (req, res) => {
    const users = readUsersFromFile();
    return res.json(users);
});

// Delete User Detail
app.delete("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let users = readUsersFromFile();
    users = users.filter(user => user.id !== id);
    writeUsersToFile(users, res);
});

// Add New User
app.post("/users", (req, res) => {
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        console.log("Missing fields:", { name, age, city });
        return res.status(400).send({ "message": "All Fields Required" });
    }

    let users = readUsersFromFile();
    let id = Date.now();
    users.push({ id, name, age, city });

    writeUsersToFile(users, res);
});

// Update User
app.patch("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let { name, age, city } = req.body;

    if (!name || !age || !city) {
        console.log("Missing fields:", { name, age, city });
        return res.status(400).send({ "message": "All Fields Required" });
    }

    let users = readUsersFromFile();
    let index = users.findIndex((user) => user.id === id);

    if (index === -1) {
        return res.status(404).send({ "message": "User not found" });
    }

    users[index] = { id, name, age, city };

    writeUsersToFile(users, res);
});

app.listen(port, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`App is running on port ${port}`);
    }
});