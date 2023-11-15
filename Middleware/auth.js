const jwt = require('jsonwebtoken');
const roles = require('./roles')
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const role = req.headers.role;
  console.log("Token "+token)
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, "Pr0J3cTB3rSAm4B40b31", (err, decoded) => {
    console.log(token)
    console.log(req.path)
    if (err) {
      console.log(err)
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      }
      return res.status(401).json({ message: 'Token is not valid' });
    }
    if (role && roles[role] && (roles[role].includes(req.path) || matchesDynamicRoute(roles[role], req.path))) {
      req.user = decoded.user;
      next();
    } else {
      return res.status(403).json({ message: 'Sorry, you cannot access this page' });
    }
  });
};

const matchesDynamicRoute = (routes, path) => {
  return routes.some(route => {
    if (route.includes(':')) {
      const routeRegex = new RegExp(`^${route.replace(/:[^/]+/g, '([^/]+)')}$`);
      return routeRegex.test(path);
    }
    return false;
  });
};
module.exports = verifyToken;
