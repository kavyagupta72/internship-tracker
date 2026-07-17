const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function signupErrorResponse(err) {
  if (err.code === "23505") {
    return { status: 409, body: { error: "User already exists" } };
  }
  const map = {
    23502: "Database rejected the row (NOT NULL constraint).",
    23514: "Database constraint failed.",
    "42P01": "Table missing. Ensure your database schema is initialized.",
    42703: "Database columns do not match this API version.",
    "28P01": "PostgreSQL rejected the password in DATABASE_URL.",
    "3D000": "The database name in DATABASE_URL does not exist on this server.",
    "28000": "Database authentication failed.",
    ECONNREFUSED: "Cannot reach PostgreSQL (connection refused).",
    ENOTFOUND: "Database hostname in DATABASE_URL could not be resolved.",
    ETIMEDOUT: "Database connection timed out.",
  };
  const hint = map[err.code];
  if (hint) return { status: 500, body: { error: hint } };
  const low = (err.message || "").toLowerCase();
  if (
    low.includes("password authentication failed") ||
    low.includes("authentication failed")
  ) {
    return {
      status: 500,
      body: {
        error: "PostgreSQL login failed — DATABASE_URL user/password is wrong or expired.",
      },
    };
  }
  return null;
}

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({ error: "username, email, and password are required" });
    }

    if (Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({ error: "Password must be at most 72 bytes" });
    }

    const user = await pool.query(
      "SELECT * FROM public.users WHERE LOWER(TRIM(email)) = $1",
      [email.trim().toLowerCase()]
    );
    if (user.rows.length !== 0) {
      return res.status(401).json({ error: "User already exists" });
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO public.users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [username.trim(), email.trim().toLowerCase(), bcryptPassword]
    );

    const secret = (process.env.JWT_SECRET || "SECRET_KEY_HERE").trim();
    const token = jwt.sign({ id: newUser.rows[0].id }, secret, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("signup error:", {
      message: err.message,
      code: err.code,
      detail: err.detail,
      constraint: err.constraint,
      stack: err.stack?.split("\n").slice(0, 4).join(" | "),
    });
    const mapped = signupErrorResponse(err);
    if (mapped) return res.status(mapped.status).json(mapped.body);
    const expose =
      process.env.DEBUG_API === "1" && err.message
        ? { error: "Server Error", detail: err.message }
        : { error: "Server Error" };
    res.status(500).json(expose);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await pool.query(
      "SELECT * FROM public.users WHERE LOWER(TRIM(email)) = $1",
      [email.trim().toLowerCase()]
    );

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Email or Password");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);

    if (!validPassword) {
      return res.status(401).json("Invalid Email or Password");
    }

    const secret = (process.env.JWT_SECRET || "SECRET_KEY_HERE").trim();
    const token = jwt.sign({ id: user.rows[0].id }, secret, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};