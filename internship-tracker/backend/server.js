const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(cors({
  origin: "https://your-frontend-url.vercel.app" 
}));
app.use(express.json()); // Allows us to read JSON data sent by the frontend

// ROUTE: Get all applications for a specific user
app.get('/applications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // We use $1 to prevent "SQL Injection" (a common hacking method)
    const result = await pool.query(
      "SELECT * FROM applications WHERE user_id = $1", 
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post('/applications', async (req, res) => {
  try {
    // 1. Destructure the data coming from the frontend (req.body)
    const { user_id, company_name, role, status, stipend, location } = req.body;

    // 2. Insert into the database
    // RETURNING * tells Postgres to send back the row it just created
    const newApplication = await pool.query(
      "INSERT INTO applications (user_id, company_name, role, status, stipend, location) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [user_id, company_name, role, status, stipend, location]
    );

    // 3. Send the new data back to the frontend as confirmation
    res.json(newApplication.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ROUTE: Get a single specific internship detail
app.get('/applications/detail/:id', async (req, res) => {
  try {
    const { id } = req.params; // Grabs the ID from the URL (e.g., /applications/detail/5)
    
    const result = await pool.query(
      "SELECT * FROM applications WHERE id = $1", 
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json("Application not found");
    }

    res.json(result.rows[0]); // Return only the first (and only) result
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ROUTE: Update an internship (e.g., change status from 'Applied' to 'Interviewing')
app.put('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, stipend, notes } = req.body;

    // We use COALESCE so that if you don't want to update a field, it keeps the old value
    const updateApp = await pool.query(
      "UPDATE applications SET status = $1, stipend = $2, notes = $3 WHERE id = $4 RETURNING *",
      [status, stipend, notes, id]
    );

    res.json("Application was updated!");
  } catch (err) {
    console.error(err.message);
  }
});
app.put('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, role, status, stipend, location, notes } = req.body;

    await pool.query(
      "UPDATE applications SET company_name = $1, role = $2, status = $3, stipend = $4, location = $5, notes = $6 WHERE id = $7",
      [company_name, role, status, stipend, location, notes, id]
    );

    res.json("Updated successfully!");
  } catch (err) {
    console.error(err.message);
  }
});

// ROUTE: Delete an internship
app.delete('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM applications WHERE id = $1", [id]);
    
    res.json("Application was deleted!");
  } catch (err) {
    console.error(err.message);
  }
});

// ROUTE: User Registration (Signup)
app.post('/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if user already exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length !== 0) {
      return res.status(401).send("User already exists");
    }

    // 2. Hash the password (Salting)
    // We do this so if your DB is hacked, the hacker can't see passwords.
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 3. Save the user to the database
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [username, email, bcryptPassword]
    );

    // 4. Generate a Token (The Digital ID Card)
    const token = jwt.sign({ id: newUser.rows[0].id }, "SECRET_KEY_HERE", { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ROUTE: User Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if the user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if (user.rows.length === 0) {
      // 401 means "Unauthorized"
      return res.status(401).json("Invalid Email or Password");
    }

    // 2. Check if the incoming password matches the Scrambled (Hashed) password in the DB
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);

    if (!validPassword) {
      return res.status(401).json("Invalid Email or Password");
    }

    // 3. If everything is correct, give them a Token
    const token = jwt.sign({ id: user.rows[0].id }, "SECRET_KEY_HERE", { expiresIn: "1h" });

    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));