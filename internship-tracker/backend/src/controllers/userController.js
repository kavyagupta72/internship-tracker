const pool = require('../../config/db');
const bcrypt = require('bcrypt');

// 1. Fetch user profile data (like email and username)
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Select only what we need; NEVER select password_hash for a read-only profile request
    const userResult = await pool.query(
      "SELECT id, username, email FROM public.users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userResult.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// 2. Change password securely
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both current and new passwords are required." });
    }

    // A. Retrieve the user's existing hashed password
    const userResult = await pool.query(
      "SELECT password_hash FROM public.users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password_hash } = userResult.rows[0];

    // B. Verify current password matches
    const isMatch = await bcrypt.compare(currentPassword, password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    // C. Validate new password length
    if (Buffer.byteLength(newPassword, "utf8") > 72) {
      return res.status(400).json({ error: "Password must be at most 72 bytes" });
    }

    // D. Hash and save new password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await pool.query(
      "UPDATE public.users SET password_hash = $1 WHERE id = $2",
      [hashedNewPassword, userId]
    );

    res.json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};