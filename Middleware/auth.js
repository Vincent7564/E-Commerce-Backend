// authMiddleware.js

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, "Pr0J3cTB3rSAm4B40b31", (err, decoded) => {
    console.log(token)
    if (err) {
      console.log(err)
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = decoded.user;
    next();
  });
};

module.exports = verifyToken;
