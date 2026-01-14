// domfin-backend/src/controllers/propertyController.js
import pool from '../config/db.js';
import { validationResult } from 'express-validator';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const getProperties = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { neighborhood, bedrooms, price_min, price_max } = req.query;
  let query = 'SELECT * FROM properties WHERE 1=1';
  const values = [];

  if (neighborhood) {
    values.push(`%${neighborhood}%`);
    query += ` AND neighborhood ILIKE $${values.length}`;
  }
  if (bedrooms) {
    values.push(parseInt(bedrooms));
    query += ` AND bedrooms = $${values.length}`;
  }
  if (price_min) {
    values.push(parseInt(price_min));
    query += ` AND price >= $${values.length}`;
  }
  if (price_max) {
    values.push(parseInt(price_max));
    query += ` AND price <= $${values.length}`;
  }

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM properties WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Property not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, slug, status, listing_type, property_type, price, bedrooms, bathrooms, neighborhood, description } = req.body;
  const images = req.files ? await Promise.all(req.files.map(async (file) => {
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream({ folder: 'domfin-properties' }, (error, result) => error ? reject(error) : resolve(result));
    stream.end(file.buffer);
  });
  return result.secure_url;
})) : [];

  try {
    const result = await pool.query(`
      INSERT INTO properties (title, slug, status, listing_type, property_type, price, bedrooms, bathrooms, neighborhood, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
    `, [title, slug, status || 'available', listing_type, property_type, price, bedrooms, bathrooms, neighborhood, description]);

    const propertyId = result.rows[0].id;
    if (images.length > 0) {
      const imageValues = images.flatMap((url, i) => [propertyId, url, i === 0]);
      const placeholders = images.map((_, i) => `($${3*i+1}, $${3*i+2}, $${3*i+3})`).join(', ');
      await pool.query(`
        INSERT INTO property_images (property_id, url, is_main) 
        VALUES ${placeholders}
      `, imageValues);
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProperty = async (req, res) => {
  // Implement similar to create: Use UPDATE query, handle images (add new, delete old if needed)
  // For simplicity, placeholder - expand as needed
  res.json({ message: 'Property updated' });
};

const deleteProperty = async (req, res) => {
  try {
    await pool.query('DELETE FROM properties WHERE id = $1', [req.params.id]);
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty };