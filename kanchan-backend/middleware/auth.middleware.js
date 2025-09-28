const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  // Handle both "Bearer" and "bearer" cases
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ message: "Invalid authorization format. Use 'Bearer <token>'" });
  }
  
  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Token not found in authorization header" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('✅ User authenticated:', { id: decoded.id, role: decoded.role });
    next();
  } catch (err) {
    console.error('❌ JWT verification failed:', err.message);
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
}

module.exports = authMiddleware;
