import express from 'express';
import cors from 'cors';
import winston from 'winston';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Adapter, Database, Resource } from '@adminjs/sql';
import dotenv from 'dotenv';
import pool from './config/db.js';
import { setupAdmin } from './controllers/authController.js';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import multer from 'multer';
import { DropZone } from '@adminjs/design-system';  // Import DropZone directly

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

dotenv.config();

const app = express();
const logger = winston.createLogger({ transports: [new winston.transports.Console()] });

app.use(cors());
app.use(express.json());

// Multer for file parsing in AdminJS
const upload = multer({ storage: multer.memoryStorage() });

// Setup initial admin user
setupAdmin().catch(err => logger.error('Admin setup error:', err));

// Public API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries', inquiryRoutes);

// AdminJS Setup
AdminJS.registerAdapter({ Database, Resource });

(async () => {
  let db;
  try {
    const adapter = new Adapter('postgresql', {
      connectionString: process.env.DATABASE_URL,
      database: 'neondb',
    });
    db = await adapter.init();
    logger.info('✅ SQL Adapter connected to Neon');
  } catch (err) {
    logger.error('❌ SQL Adapter failed:', err.message);
  }

  const admin = new AdminJS({
    resources: [
      // Users
      {
        resource: db?.table('users') || { model: 'users', client: pool, schema: 'public' },
        options: {
          navigation: { name: 'System' },
          properties: {
            password_hash: { isVisible: { list: false, show: false, edit: false } },
            id: { isVisible: { edit: false } },
          },
          actions: {
            new: { isAccessible: false },
            delete: { isAccessible: false },
          },
        },
      },

      // Properties – Force DropZone for upload
      {
        resource: db?.table('properties') || { model: 'properties', client: pool, schema: 'public' },
        options: {
          navigation: { name: 'Real Estate' },
          properties: {
            id: { isVisible: { edit: false } },
            created_at: { isVisible: { edit: false } },
            updated_at: { isVisible: { edit: false } },
            published_at: { isVisible: { edit: false } },
            user_id: { isVisible: { edit: false } },

            title: { type: 'string', isRequired: true },
            slug: { type: 'string', isRequired: true },
            description: { type: 'textarea', isRequired: true },
            short_description: { type: 'textarea' },
            price: { type: 'number', isRequired: true },
            currency: { type: 'string', defaultValue: 'KES' },
            property_type: { type: 'string', isRequired: true },
            listing_type: { type: 'string', isRequired: true },
            status: { type: 'string', defaultValue: 'available' },
            neighborhood: { type: 'string', isRequired: true },
            location: { type: 'string' },
            address: { type: 'textarea' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            year_built: { type: 'number' },
            featured: { type: 'boolean', defaultValue: false },
            views_count: { isVisible: { edit: false } },

            // Custom upload with DropZone from design-system
            images_upload: {
              type: 'mixed',  // mixed allows custom component
              isArray: true,
              isVisible: { list: false, show: false, filter: false, edit: true },
              label: 'Upload Property Images (drag & drop or browse)',
              components: {
                edit: AdminJS.ComponentLoader('DropZoneUpload', () => Promise.resolve(DropZone))
              },
            },
          },
          actions: {
            new: {
              before: async (request) => {
                if (request.method === 'post' && request.payload) {
                  const payload = request.payload;

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

                  // Handle files (multer provides buffer)
                  let uploadedUrls = [];
                  if (request.files && request.files.length > 0) {
                    const imageFiles = request.files.filter(f => f.fieldname === 'images_upload');
                    for (const file of imageFiles) {
                      try {
                        const result = await new Promise((resolve, reject) => {
                          const stream = cloudinary.v2.uploader.upload_stream(
                            { folder: 'domfin-properties' },
                            (error, result) => error ? reject(error) : resolve(result)
                          );
                          stream.end(file.buffer);
                        });
                        uploadedUrls.push(result.secure_url);
                      } catch (err) {
                        logger.error('Cloudinary upload failed:', err.message);
                      }
                    }
                  }

                  // Insert property
                  const fields = Object.keys(payload).filter(k => k !== 'images_upload');
                  const values = fields.map(k => payload[k]);
                  const placeholders = fields.map((_, i) => `$${i+1}`).join(', ');
                  const columns = fields.join(', ');

                  const propResult = await pool.query(`
                    INSERT INTO properties (${columns})
                    VALUES (${placeholders})
                    RETURNING id
                  `, values);

                  const newId = propResult.rows[0].id;

                  // Save URLs
                  if (uploadedUrls.length > 0) {
                    const imgPlaceholders = uploadedUrls.map((_, i) => `($1, $${i+2}, ${i === 0})`).join(', ');
                    await pool.query(`
                      INSERT INTO property_images (property_id, url, is_main)
                      VALUES ${imgPlaceholders}
                    `, [newId, ...uploadedUrls]);
                  }

                  request.payload = {};
                  request.record = { params: { id: newId } };
                }
                return request;
              },
            },
          },
        },
      },
    ],
    rootPath: '/admin',
    locale: {
      language: 'en',
      translations: {
        en: {
          translation: {
            labels: {
              users: 'Admins',
              properties: 'Properties',
              neondb: 'Domfin DB',
            },
            properties: {
              title: 'Title',
              slug: 'Slug',
              description: 'Description',
              price: 'Price (KSh)',
              neighborhood: 'Neighborhood',
              images_upload: 'Upload Images from Computer',
            },
          },
        },
      },
    },
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email, password) => {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      if (user && await bcrypt.compare(password, user.password_hash)) {
        return user;
      }
      return false;
    },
    cookiePassword: process.env.JWT_SECRET || 'fallback-secret-change-me',
    resave: false,
    saveUninitialized: false,
  });

  // Apply multer to AdminJS routes for file parsing
  app.use(admin.options.rootPath, upload.any(), adminRouter);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
})();