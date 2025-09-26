import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'wellwisher-ai-buddy-secret-key-2024';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { 
      expiresIn: JWT_EXPIRE,
      issuer: 'wellwisher-ai-buddy',
      audience: 'wellwisher-users'
    }
  );
};

// Middleware to verify JWT Token
const authenticateToken = async (req, res, next) => {
  try {
    console.log('🔐 Authentication middleware triggered');
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('📋 Auth header present:', !!authHeader);
    console.log('🎫 Token extracted:', token ? `${token.substring(0, 20)}...` : 'No token');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access token is missing or invalid'
      });
    }

    // Verify token
    console.log('🔍 Verifying JWT token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token decoded successfully:', {
      userId: decoded.userId,
      exp: new Date(decoded.exp * 1000),
      iat: new Date(decoded.iat * 1000)
    });
    
    // Get user from database
    console.log('👤 Fetching user from database:', decoded.userId);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('❌ User not found in database:', decoded.userId);
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user not found'
      });
    }

    console.log('✅ User found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      lastLogin: user.lastLogin
    });

    if (!user.isActive) {
      console.log('❌ User account is deactivated:', user.email);
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    // Attach user to request object
    req.user = user;
    console.log('✅ User session established for:', user.email);
    next();

  } catch (error) {
    console.error('❌ Authentication error:', {
      name: error.name,
      message: error.message
    });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    } else {
      console.error('Authentication error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

export {
  generateToken,
  authenticateToken,
  optionalAuth
};