const express = require('express');
const router = express.Router();
const { userSignupValidator } = require("../validator/index")
const { create } = require('../controllers/product');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const { userById } = require("..//controllers/user")

// router
router.post('/product/create/:userId', requireSignin, isAdmin, isAuth, create);

router.param("userId", userById)

module.exports = router;