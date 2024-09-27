require('dotenv').config(); // Load environment variables
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import path module for serving files
const { body, validationResult } = require('express-validator'); // For input validation

const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = ['https://tac-qjn2.onrender.com', 'http://localhost:3000']; // Add your allowed origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204 // For legacy browser support
};
app.use(cors(corsOptions));

// MySQL connection
const con = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Registration Details"
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

// Registration endpoint with input validation
app.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    body('gender').notEmpty().withMessage('Gender is required'),
    body('dob').notEmpty().withMessage('Date of birth is required'),
    body('weight').notEmpty().withMessage('Weight is required'),
    body('height').notEmpty().withMessage('Height is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, gender, dob, weight, height } = req.body;

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

// Login endpoint with input validation
app.post('/login', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

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

// Close database connection gracefully
process.on('SIGINT', () => {
    con.end(err => {
        if (err) {
            console.error('Error closing the database connection:', err);
        }
        console.log('Database connection closed.');
        process.exit();
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
