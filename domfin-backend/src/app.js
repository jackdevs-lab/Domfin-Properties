import express from 'express';
import cors from 'cors';
import winston from 'winston';
import dotenv from 'dotenv';
import pool from './config/db.js';
import { setupAdmin } from './controllers/authController.js';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import multer from 'multer';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const logger = winston.createLogger({ transports: [new winston.transports.Console()] });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session middleware for admin auth
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 1 hour
}));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Setup initial admin user
setupAdmin().catch(err => logger.error('Admin setup error:', err));

// Public API Routes (keep token auth)
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Custom Admin Routes
const adminRouterCustom = express.Router();

// Admin login page
adminRouterCustom.get('/login', (req, res) => {
  res.render('admin-login', { error: null }); // Pass error: null to avoid ReferenceError
});

// Admin login post
adminRouterCustom.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password_hash)) {
      req.session.userId = user.id; // Set session
      res.redirect('/admin/properties');
    } else {
      res.render('admin-login', { error: 'Invalid credentials' });
    }
  } catch (err) {
    res.render('admin-login', { error: 'Server error' });
  }
});

// Middleware to check session for admin routes
adminRouterCustom.use((req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/admin/login');
  }
  next();
});

// GET /admin/properties - List properties
adminRouterCustom.get('/properties', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM properties ORDER BY created_at DESC');
    res.render('properties-list', { properties: result.rows });
  } catch (err) {
    logger.error('List properties error:', err);
    res.status(500).send('Server error');
  }
});

// GET /admin/properties/new - New property form
adminRouterCustom.get('/properties/new', (req, res) => {
  res.render('properties-new');
});

// POST /admin/properties - Create property
adminRouterCustom.post('/properties', upload.array('images', 5), async (req, res) => {
  const payload = req.body;

  logger.info('Creating property with payload: ' + JSON.stringify(payload, null, 2));

  // Fix empty numeric fields
  ['price', 'latitude', 'longitude', 'year_built'].forEach(field => {
    if (payload[field] === '' || payload[field] === undefined) {
      payload[field] = null;
    } else if (typeof payload[field] === 'string') {
      payload[field] = parseFloat(payload[field]) || null;
    }
  });

  // Auto timestamps & slug
  const now = new Date().toISOString();
  payload.created_at = now;
  payload.updated_at = now;
  if (payload.title && !payload.slug) {
    payload.slug = payload.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Handle files
  let uploadedUrls = [];
  if (req.files && req.files.length > 0) {
    logger.info('Files received: ' + req.files.length);
    for (const file of req.files) {
      logger.info('Uploading file: ' + file.originalname);
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            { folder: 'domfin-properties' },
            (error, result) => error ? reject(error) : resolve(result)
          );
          stream.end(file.buffer);
        });
        uploadedUrls.push(result.secure_url);
        logger.info('Uploaded: ' + result.secure_url);
      } catch (err) {
        logger.error('Cloudinary upload failed: ' + err.message);
      }
    }
  } else {
    logger.info('No files received');
  }

  // Insert property
  const fields = Object.keys(payload);
  const values = fields.map(k => payload[k]);
  const placeholders = fields.map((_, i) => `$${i+1}`).join(', ');
  const columns = fields.join(', ');

  logger.info('Inserting property with columns: ' + columns);
  const propResult = await pool.query(`
    INSERT INTO properties (${columns})
    VALUES (${placeholders})
    RETURNING id
  `, values);

  const newId = propResult.rows[0].id;
  logger.info('Inserted property with ID: ' + newId);

  // Save URLs to property_images
  if (uploadedUrls.length > 0) {
    logger.info('Inserting ' + uploadedUrls.length + ' images');
    const imgPlaceholders = uploadedUrls.map((_, i) => `($1, $${i+2}, ${i === 0})`).join(', ');
    await pool.query(`
      INSERT INTO property_images (property_id, url, is_main)
      VALUES ${imgPlaceholders}
    `, [newId, ...uploadedUrls]);
    logger.info('Images inserted');
  }

  res.redirect('/admin/properties');
});

app.use('/admin', adminRouterCustom);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});