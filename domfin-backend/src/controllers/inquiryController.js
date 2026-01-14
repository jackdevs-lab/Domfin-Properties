// domfin-backend/src/controllers/inquiryController.js
import pool from '../config/db.js';
import { validationResult } from 'express-validator';

const createInquiry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { full_name, phone, email, message, property_id } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO inquiries (full_name, phone, email, message, property_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [full_name, phone, email, message, property_id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getInquiries = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inquiries');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createInquiry, getInquiries };