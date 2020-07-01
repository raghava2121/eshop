const express = require('express');
const router = express.Router();
const { userSignupValidator } = require("../validator/index")
const { create } = require('../controllers/category');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const { userById } = require("..//controllers/user");
const { route } = require('./auth');
const { categoryById, read, update, remove, list} = require("..//controllers/category");

// router
router.post('/category/create/:userId', requireSignin, isAdmin, isAuth, create);

router.get('/category/:categoryId',read);
router.put('/category/:categoryId/:userId', requireSignin, isAdmin, isAuth, update);
router.delete('/category/:categoryId/:userId', requireSignin, isAdmin, isAuth, remove);

router.get('/categories',list);

router.param('categoryId', categoryById)
router.param("userId", userById);


module.exports = router;