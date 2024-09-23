const jwt = require('jsonwebtoken');
const status = require('../config/status');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Ensure the 'Bearer' token format is followed
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, status: status.UNAUTHORIZED, msg: 'No token provided, authorization denied' });
    }

    const token = req.header('Authorization').split(' ')[1]; // Ensure Bearer is removed
console.log('Token being verified:', token);
console.log('JWT_SECRET during verification:', process.env.JWT_SECRET);

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
} catch (err) {
  console.error('Token verification error:', err);
  return res.status(401).json({ success: false, status: 'UNAUTHORIZED', msg: 'Token is not valid' });
}

};

module.exports = auth;
