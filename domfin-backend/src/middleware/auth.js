// domfin-backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Optional IP whitelist
const ipWhitelist = (req, res, next) => {
  const allowedIps = process.env.ALLOWED_IPS ? process.env.ALLOWED_IPS.split(',') : [];
  if (allowedIps.length > 0 && !allowedIps.includes(req.ip)) {
    return res.status(403).json({ message: 'IP not allowed' });
  }
  next();
};

export { authMiddleware, ipWhitelist };