const router          = require('express').Router(),
      UserController  = require(Controllers + 'user');
      
let userController = new UserController();

router.get('/:id', userController.get);
router.post('/user/', userController.create);

module.exports = router;