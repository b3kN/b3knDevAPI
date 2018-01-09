const express = require('express'),
      router = express.Router();
      
router.use('/auth', require(Routes + 'auth'));
router.use('/users', require(Routes + 'user'));

module.exports = router;