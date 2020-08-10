var express = require('express');
var router = express.Router();

const mongoAPI = require("./API/mongo")
router.use("/API/mongo", mongoAPI);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
