var fs = require('fs');
var path = require('path');

util = {
   readFile: function(path) {
      //console.log(path);
      var data = fs.readFileSync(path);
      return data.toString();
   }
};
module.exports = util;
