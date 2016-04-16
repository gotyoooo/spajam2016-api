var express = require('express');
var router = express.Router();


var fs = require('fs');
var log_file = './chat.csv';

/* GET home page. */
router.get('/', function(req, res, next) {

  var data = {
    "to": "you",
    "from": "result.content.from",
    "text": "hogehoge"
  };
  fs.appendFile(log_file, data.to + ',' + data.from + ',' + data.text + '\n' ,'utf8', function (err) {
    console.log(err);
  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
