const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const { userById } = require("..//controllers/user");
const { productById, read, create, remove, update, list, listRelated, listCategories, listBySearch,photo } = require('../controllers/product');
const { Router } = require('express');

// router
router.post('/product/create/:userId', requireSignin, isAdmin, isAuth, create);
router.get('/product/:productId', read);
router.delete('/product/:productId/:userId', requireSignin, isAdmin, isAuth, remove)
router.put('/product/:productId/:userId', requireSignin, isAdmin, isAuth, update)
router.get("/products", list)
router.get("/products/related/:productId", listRelated);
router.param("userId", userById)
router.param("productId", productById);

// route - make sure its post
router.post("/products/by/search", listBySearch);

router.get("/products/categories", listCategories);
router.get("/products/photo/:productId", photo);
module.exports = router;

