// domfin-backend/src/middleware/validator.js
import { body } from 'express-validator';

// Example for properties
const propertyValidation = [
  body('title').notEmpty(),
  body('price').isNumeric(),
  // Add more as needed
];

export { propertyValidation };