const authorize = (roles) => {
  return (req, res, next) => {
    const req_user_role = req.user.role;

    if (roles.includes(req_user_role)) {
      next();
    } else {
      res.status(403).json({ msg: 'Unauthorized' });
    }
  };
};

module.exports = authorize;
