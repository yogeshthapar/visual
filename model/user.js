 var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
   name: String,
   emailId: String,
   pwd: String,
   preferences:[{
      _id: false,
      theme:String,
      showLegend: Boolean
   }],
   dashboards: [{
      sharedWith: [mongoose.Schema.Types.Mixed],
      tabs: [{tabTitle: String,
         tabId: String,
         rows: [{
            rowId: String,
            colWidth: String,
            widgetId: String
         }]
      }]
   }]
}, {strict: false});

UserSchema.statics.getDashboard = function (emailId, callback) {
   this.model('User').find({
      'emailId': emailId
   }, {
      'dashboards': 1,
      '_id': 0
   },function(err, data) {
      var tabs = {};
      if(data && data.length > 0 && data[0].dashboards.length > 0) {
         tabs = data[0].dashboards[0].tabs;
      }
      callback(tabs);
   });
}

UserSchema.statics.getTabs = function (emailId, callback) {

   this.model('User').find({
      'emailId': emailId
   }, {
      'preferences.theme': 1,
      'dashboards.tabs.tabTitle': 1,
      'dashboards.tabs.tabId': 1,
      '_id': 0
   },function(err, data) {
      var tabs = [];
      if(data && data.length > 0 && data[0].dashboards.length > 0) {
         tabs = data[0];
      }
      callback(tabs);
   });
}

UserSchema.statics.findById = function(id, callback) {
   this.model('User').findOne({"emailId" : id }, {
      "_id": 0,
      "pwd": 1,
      "emailId": 1,
      "name": 1}, function(err, data) {
      callback(err, data);
   })
}

UserSchema.statics.setUserTheme=function(id, userTheme){
   this.model('User').update({
     'emailId' : id
   },{
     $set: {
       preferences:{
         theme:userTheme
       }
     }
   },function(err, userTheme) {
   });
}

module.exports = mongoose.model("User", UserSchema);
