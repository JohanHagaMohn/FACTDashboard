var express = require('express');
var router = express.Router();

const data = require("./neo4jTestData.json")

router.get("/example", (req, res, next) => {
  res.json(data)
})

module.exports = router;