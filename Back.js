const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import path module for serving files
const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Registration Details"
});

con.connect(function(err) {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to the database!");
});

// Serve static files (like HomePage.html) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve HomePage.html when visiting the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'HomePage.html'));
});

// Registration endpoint
app.post('/register', (req, res) => {
    const { name, email, password, gender, dob, weight, height } = req.body;

    if (!name || !email || !password || !gender || !dob || !weight || !height) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const sql = "INSERT INTO Registration_Table (Name, Gender, Email, Date_of_birth, Password, Weight, Height) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [name, gender, email, dob, password, weight, height];

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ success: false, message: "SQL Error occurred." });
        }
        res.json({ success: true });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const sql = "SELECT * FROM Registration_Table WHERE Email = ? AND Password = ?";
    const values = [email, password];

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("SQL Error during login query:", err);
            return res.status(500).json({ success: false, message: "Database error during login." });
        }

        if (result.length > 0) {
            console.log("Login successful for user:", email);
            res.json({ success: true });
        } else {
            console.log("Login failed: incorrect email or password for user:", email);
            res.json({ success: false });
        }
    });
});

// Get all registrations
app.get('/registrations', (req, res) => {
    con.query("SELECT * FROM Registration_Table", (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ success: false, message: "Error retrieving registrations." });
        }
        res.json(result);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
