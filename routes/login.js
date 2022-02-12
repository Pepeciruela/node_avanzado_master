const express = require('express');
const router = express.Router();

//GET LOGIN
router.get('/', (req, res, next) => {
    res.render('login')
});

module.exports = router;