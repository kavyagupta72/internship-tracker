const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); // 1. Import rate limiter
const pool = require('./config/db'); // Points to db.js inside config folder
const app = express();

const authRoutes = require('./src/routes/authRoutes');
const appRoutes = require('./src/routes/appRoutes');
const userRoutes = require('./src/routes/userRoutes');

// 1. CORS Configuration
const allowedOrigins = [
  'https://your-production-frontend-url.com', // Replace with your real live URL
];
app.use(
  cors({
    origin: (origin, callback) => {
      const isLocalhost =
        /^http:\/\/localhost:\d+$/.test(origin || "") ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin || "");

      // Allow if there is no origin (Postman/cURL), if it's localhost, or if it matches production allowed origins
      if (!origin || isLocalhost || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    }
  })
);

// 2. Rate Limiter Configuration
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes" }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login/signup attempts per windowMs
  message: { error: "Too many login/signup attempts from this IP, please try again after 15 minutes" }
});

// Apply global rate limiter to all incoming requests
app.use(globalLimiter);

app.use(express.json());

// 3. Base Utility Routes
app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "internship-tracker-api",
    note: "Set DATABASE_URL to a valid postgresql:// connection string.",
    try: ["/health"],
  });
});

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, database: true });
  } catch (err) {
    console.error("health check failed:", err);
    res.status(503).json({ ok: false, database: false });
  }
});

// 4. API Route Modules (Apply strict authLimiter specifically to /auth routes)
app.use('/auth', authLimiter, authRoutes);              // Prepends '/auth' with brute-force protection
app.use('/applications', appRoutes);      // Prepends '/applications' to CRUD endpoints
app.use('/users', userRoutes);

// 5. 404 Fallback Middleware
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.path,
    hint: "This host is the REST API only. Try GET / or GET /health.",
  });
});

const PORT = process.env.PORT || 5000;

function printDbStartupHelp(err) {
  const code = err.code || err.errors?.[0]?.code;
  console.error("\nDatabase schema init failed:", err.message || err);
  if (code === "ETIMEDOUT" || code === "ECONNREFUSED") {
    console.error(`
Cannot reach PostgreSQL. Your backend/.env points at a remote host (e.g. Neon).
Many networks block outbound port 5432, so the API never starts and signup shows "Network Error".

Fix for local development:
  1. Create backend/.env.local with:
     DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/internship_tracker
  2. Create the database:
     CREATE DATABASE internship_tracker;
  3. Restart: npm start
`);
  } else if (code === "28P01") {
    console.error("\nWrong PostgreSQL password in DATABASE_URL. Update backend/.env.local and restart.\n");
  } else if (code === "3D000") {
    console.error('\nDatabase does not exist. Run: CREATE DATABASE internship_tracker;\n');
  }
}

// 6. Database Connect & Server Start
pool
  .ensureSchema()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    printDbStartupHelp(err);
    process.exit(1);
  });