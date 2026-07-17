const pool = require('../../config/db');

exports.getAllApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM public.applications WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.createApplication = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { company_name, role, status, stipend, location } = req.body;

    const newApplication = await pool.query(
      `INSERT INTO public.applications
       (user_id, company_name, role, status, stipend, location)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [user_id, company_name, role, status, stipend, location]
    );

    res.json(newApplication.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getApplicationDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "SELECT * FROM public.applications WHERE id = $1", 
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json("Application not found");
    }

    res.json(result.rows[0]); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, role, status, stipend, location, notes } = req.body;

    // Consolidating your routes to ensure all update values are handled gracefully
    await pool.query(
      "UPDATE public.applications SET company_name = $1, role = $2, status = $3, stipend = $4, location = $5, notes = $6 WHERE id = $7",
      [company_name, role, status, stipend, location, notes, id]
    );

    res.json("Updated successfully!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM public.applications WHERE id = $1", [id]);
    
    res.json("Application was deleted!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};