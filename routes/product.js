const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const { userById } = require("..//controllers/user");
const { productById ,read, create, remove} = require('../controllers/product');
const { Router } = require('express');

// router
router.post('/product/create/:userId', requireSignin, isAdmin, isAuth, create);
router.get('/product/:productId', read);
router.delete('/product/:productId/:userId', requireSignin, isAdmin, isAuth, remove)
router.param("userId", userById)
router.param("productId", productById)

module.exports = router;