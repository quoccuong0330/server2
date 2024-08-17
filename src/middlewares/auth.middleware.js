const isAuthenticated = (req, res, next) => {
  res.redirect("/control");
};

module.exports = { isAuthenticated };
