var express = require('express');
var router = express.Router();

const data = require("./neo4jTestData/data.json")

router.get("/example", (req, res, next) => {
  res.json(data)
})

module.exports = router;
