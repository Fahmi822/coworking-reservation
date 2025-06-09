import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = ({ req }) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { user: decoded };
    }
    return {};
  } catch (err) {
    throw new Error("Token invalide");
  }
};