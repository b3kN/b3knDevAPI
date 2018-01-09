const router          = require('express').Router(),
      AuthController  = require(Controllers + 'auth');

let authController    = new AuthController();

router.post('/', authController.create);
router.delete('/:token', authController.remove);

module.exports = router;