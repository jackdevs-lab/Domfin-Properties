// src/app.js - Updated to load dotenv at the top and handle async setup properly

import express from 'express';
import cors from 'cors';
import winston from 'winston';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Adapter, Database, Resource } from '@adminjs/sql';  // Correct import
import dotenv from 'dotenv';  // Add this import
import pool from './config/db.js';
import { setupAdmin } from './controllers/authController.js';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';

dotenv.config();  // Load .env at the very top

const app = express();
const logger = winston.createLogger({ transports: [new winston.transports.Console()] });

app.use(cors());
app.use(express.json());

// Setup admin user on start (now env is loaded)
setupAdmin().catch(err => logger.error('Admin setup error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries', inquiryRoutes);

// AdminJS Setup - Corrected for @adminjs/sql
AdminJS.registerAdapter({
  Database,
  Resource,
});

(async () => {
  const adapter = new Adapter('postgresql', {
    connectionString: process.env.DATABASE_URL,
    database: 'neondb',  // Confirm this matches your Neon DB name (from URL: /neondb)
  });
  const db = await adapter.init();
  
  const admin = new AdminJS({
    databases: [db],
    rootPath: '/admin',
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email, password) => {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      if (user && await import('bcrypt').then(({ default: bcrypt }) => bcrypt.compare(password, user.password_hash))) {
        return user;
      }
      return false;
    },
    cookiePassword: process.env.JWT_SECRET,
  }, null, { resave: false, saveUninitialized: true });

  app.use(admin.options.rootPath, adminRouter);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
})();