const express = require('express');
const router = express.Router();
const ATMController = require('../controller/ATMController');
const { withdraw } = require('../helpers/validations');

/* GET home page. */
router.route('/').get(ATMController.home);

router.route('/withdraw').post(withdraw,ATMController.withdraw);

module.exports = router;
