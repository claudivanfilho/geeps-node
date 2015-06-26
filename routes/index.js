var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.user) {
        return res.redirect('/empresa/dashboard');
    }
    res.sendFile(path.join(__dirname+'/../views/index.html'));
});

module.exports = router;
