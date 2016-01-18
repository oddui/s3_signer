var express = require('express');
var router = express.Router();
var signer = require('../signer');
var uuid = require('node-uuid');
var _ = require('lodash');

module.exports = router;

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/sign', [paramsCheck, sign]);

function paramsCheck(req, res, next) {
  var query = req.query;

  if (query.Operation && query.Bucket && query.ContentType) {
    next();
  } else {
    var err = new Error('Bad parameters.');
    err.status = 400;
    next(err);
  }
}

function sign(req, res, next) {
  switch(req.query.Operation) {
    case 'putObject':
      var params = _.pick(req.query, ['Bucket', 'ContentType', 'CacheControl']);

      // set Key if KeyPrefix is defined
      if (req.query.KeyPrefix) {
        params.Key = req.query.KeyPrefix + uuid.v1();
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
