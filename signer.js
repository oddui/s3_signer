var config = require('./config.json').aws;
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var _ = require('lodash');

var s3 = new AWS.S3(config);

module.exports.putUrl = putUrl;

function putUrl(params, fn) {
  s3.getSignedUrl('putObject', _.extend({
    Key: uuid.v1(),
    Expires: 60
  }, params), fn);
}

/*putUrl({
  Bucket: 'durarara-chat-assets',
  ContentType: 'text'
}, function(err, url) {
  if (err) {
    console.log(err, err.stack);
    return;
  }
  console.log(`The URL is: ${url}`);

  var body = 'some text';
  var uri = require('url').parse(url);
  var req = require('https').request(_.extend(uri, {method: 'PUT'}), function(res) {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', function() {
      console.log('No more data in response.')
    })
  });

  req.on('error', function(e) {
    console.log(`problem with request: ${e.message}`);
  });

  // Sending a 'Content-length' header will disable the default chunked encoding.
  req.setHeader('Content-Length', body.length);
  req.setHeader('Content-Type', 'text');
  req.write(body);
  req.end();
});*/
