var express = require('express')
var request = require('request')
var line_conf = require('./line_conf.json')
var fixie_conf = require('./fixie_conf.json')

var router = express.Router()
var proxy = request.defaults(fixie_conf)

var headers = {
  'Content-Type': 'application/json; charset=UTF-8',
  'X-Line-ChannelID': line_conf['X-Line-ChannelID'],
  'X-Line-ChannelSecret': line_conf['X-Line-ChannelSecret'],
  'X-Line-Trusted-User-With-ACL': line_conf['X-Line-Trusted-User-With-ACL']
}

function sendMessage(to, content) {
  var options = {
    url: 'https://trialbot-api.line.me/v1/events',
    method: 'POST',
    headers: headers,
    json: true,
    body: {
      'to': to,
      'toChannel': 1383378250,
      'eventType': "138311608800106203",
      'content':content
    }
  }
  proxy(options, (err, res, body) => {
    if (err) {
      console.log(err);
    }
    console.log(options);
    console.log(res);
    console.log(body);
  })
}

function recvOperation(content) {
  var id = [content.params[0]]
  var content = {
    "contentType":1,
    "toType":1,
    "text": 'へい！らっしゃい！！'
  }
  sendMessage(id, content)
}

router.get('/', function(req, res, next) {
  res.send('respond with a resource from callback');
});


var fs = require('fs');
var log_file = './chat.csv';
router.post('/', (req, res, next) => {
  var results = req.body.result;
  console.log(results);
  results.forEach((result) => {
    switch (result.eventType) {
      // receive operation
      case '138311609100106403':
        recvOperation(result.content)
        break;

      // receive message
      case '138311609000106303':
        var content = {
          "contentType":1,
          "toType":1,
          "text": result.content.text
        }
        //sendMessage([result.content.from], content)

        var data = {
          "to": "you",
          "from": result.content.from,
          "text": result.content.text
        };
        fs.appendFile(log_file, data.to + ',' + data.from + ',' + data.text + '\n' ,'utf8', function (err) {
            console.log(err);
        });
        break;
      default:
    }

  })
  res.json(req.body)
})

module.exports = router