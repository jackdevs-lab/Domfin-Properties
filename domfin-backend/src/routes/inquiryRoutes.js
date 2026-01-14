// domfin-backend/src/routes/inquiryRoutes.js
import express from 'express';
import { createInquiry, getInquiries } from '../controllers/inquiryController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.post('/', createInquiry);
router.get('/', authMiddleware, getInquiries);

export default router;