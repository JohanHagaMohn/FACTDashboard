var express = require('express');
var router = express.Router();

const mongoAPI = require("./API/mongo")
router.use("/API/mongo", mongoAPI);

const neo4jAPI = require("./API/neo4j")
router.use("/API/neo4j", neo4jAPI);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { index: 1 });
});

router.get('/statistics', function (req, res, next) {
  res.render('statistics', { statistics: 1 });
});

router.get('/graph', function (req, res, next) {
  res.render('graph', { graph: 1 });
});

router.get('/about', function (req, res, next) {
  res.render('about', { about: 1 });
});

router.get('/contact', function (req, res, next) {
  res.render('contact', { contact: 1 });
});

module.exports = router;
