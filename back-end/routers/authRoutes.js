const router = require('express').Router();

const {
  register,
  login,
  getAccount,
  changePassword,
} = require('../controllers/AuthController');

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', changePassword);
router.get('/account/:id', getAccount);

module.exports = router;
