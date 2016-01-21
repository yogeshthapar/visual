var mongoose = require('mongoose');

var WidgetSchema = mongoose.Schema({
   title: String,
   chartRenderer: String,
   widgetId: String,
   url: String,
   comments:[{
      userId:String,
      comment: String,
      datetime: {type:Date, default: Date.Now}
   }]
}, {strict: false});

WidgetSchema.statics.getWidgets = function(callback) {
   this.model('Widget').find({}, {
      "_id":0
   }, function(err, data) {
      callback(data);
   })
}

WidgetSchema.statics.getWidgetDetail = function(widgetId, callback) {
   this.model('Widget').findOne({
      "widgetId": widgetId
   }, {
      "_id":0
   }, function(err, data) {
      callback(data);
   })
}

module.exports = mongoose.model("Widget", WidgetSchema);
