const Criptografia = require('../estrutura/base/Criptografia');

module.exports = (req, _res, next) => {
  req.body = Criptografia.decrypt(req.body.b);
  return next();
}