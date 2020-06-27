const express = require('express');
const router = express.Router();

// router
router.get('/', (req, res) => {
    res.send('heelo from node hey')
})

module.exports = router;