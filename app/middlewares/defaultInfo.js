module.exports = function (req, res, next) {
  res.locals = {
    isLogged: !!req.user
  };
  next();
};
