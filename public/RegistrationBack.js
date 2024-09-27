const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5001; 

app.use(bodyParser.json());

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

const cors = require('cors');
app.use(cors());

app.post('/register', (req, res) => {
    const { name, email, password, gender, dob, weight, height } = req.body;

    if (!name || !email || !password || !gender || !dob || !weight || !height) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    console.log("Incoming Data:", { name, email, password, gender, dob, weight, height });

    const sql = "INSERT INTO Registration_Table (Name, Gender, Email, Date_of_birth, Password, Weight, Height) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [name, gender, email, dob, password, weight, height];  // No hashing applied

    console.log("SQL Query:", sql);
    console.log("SQL Values:", values);

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ success: false, message: "SQL Error occurred." });
        }
        res.json({ success: true });
    });
});

app.get('/registrations', (req, res) => {
    con.query("SELECT * FROM Registration_Table", (err, result) => {
        if (err) {
            return console.log(err);
        }
        res.json(result);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
