const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const productRouter = require('./product');

// รวบรวม route ย่อยมาไว้ที่นี่
router.use('/users', userRouter);
router.use('/products', productRouter);

module.exports = router;
