const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access forbidden: Role '${req.user.role}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

const requireStudent = authorizeRoles('student', 'admin');
const requireMentor = authorizeRoles('mentor', 'admin');
const requireAdmin = authorizeRoles('admin');

module.exports = {
  authorizeRoles,
  requireStudent,
  requireMentor,
  requireAdmin,
};
