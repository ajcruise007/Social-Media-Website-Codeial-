const express = require('express');

//Set up the express router
const router = express.Router();

// console.log('router loaded');

const homeController = require('../controllers/home_controller');

router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));

// To use api
router.use('/api', require('./api'));

module.exports = router;