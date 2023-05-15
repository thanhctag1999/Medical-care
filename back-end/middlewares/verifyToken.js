const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const token = req.header('auth-token');
  if(!token) return res.status(401).send({message: 'Access Denied!'});

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.user = verified;
    next();
  } catch (err) {
    res.status(300).send({message: 'Invalid Token'})
  }
}