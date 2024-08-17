const { createHttpError } = require('http-errors');

const errorHandler = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(err);
  // render the error page
  res.status(500);
  res.render('error');

  // handling non matching request from the client
  next(createHttpError(404));
};

module.exports = { errorHandler };
