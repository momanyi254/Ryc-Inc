
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/authorization');
const order = require('../controller/buys')


router.post('/', checkAuth, order.postorder);

router.get('/', order.getorders);

router.get('/:order_id', order.getsingleorder);


router.delete('/:order_id', order.deleteorder);

module.exports = router;