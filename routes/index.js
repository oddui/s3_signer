var express = require('express');
var router = express.Router();
var signer = require('../signer');
var uuid = require('node-uuid');

module.exports = router;

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/sign', [paramsCheck, sign]);

function paramsCheck(req, res, next) {
  var query = req.query;

  if (query.operation && query.bucket && query.contentType) {
    next();
  } else {
    var err = new Error('Bad parameters.');
    err.status = 400;
    next(err);
  }
}

function sign(req, res, next) {
  switch(req.query.operation) {
    case 'putObject':
      var params = {
        Bucket: req.query.bucket,
        ContentType: req.query.contentType
      }
      // set Key if keyPrefix is defined
      if (req.query.keyPrefix) {
        params.Key = req.query.keyPrefix + uuid.v1();
      }

      signer.putObject(params, function(err, url) {
        if (err) {
          next(err);
        } else {
          res.json({url: url});
        }
      });
      break;
    default:
      var err = new Error('Operation not implemented.');
      err.status = 501;
      next(err);
  }
}
