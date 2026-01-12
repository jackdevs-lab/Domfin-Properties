import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Initial setup: Run once to create admin if not exists
async function setupAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const hash = await bcrypt.hash(password, 10);

  await pool.query(`
    INSERT INTO users (email, password_hash, full_name, role) 
    VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING
  `, [email, hash, 'Admin', 'admin']);
}

export { login, setupAdmin };