const express = require('express');
const router = express.Router();

router.post('/create-session', require('../../../controllers/api/v1/users_api').createSession);

module.exports = router;