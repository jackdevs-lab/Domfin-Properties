// domfin-backend/src/routes/propertyRoutes.js
import express from 'express';
import { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty } from '../controllers/propertyController.js';
import { authMiddleware } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { propertyValidation } from '../middleware/validator.js';

const router = express.Router();
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', authMiddleware, upload.array('images', 5), propertyValidation, createProperty);
router.put('/:id', authMiddleware, upload.array('images', 5), updateProperty);
router.delete('/:id', authMiddleware, deleteProperty);

export default router;