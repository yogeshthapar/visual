var express = require('express');
var router = express.Router();
var util = require('./utils');
var path = require('path');
var Widget = require('../model/widget');

router.get('/:widgetId', function(req, res, next) {
   var widgetId = req.params.widgetId;
   Widget.getWidgetDetail(widgetId, function(data) {
      res.send(data);
   });

});

module.exports = router;
