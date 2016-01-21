var cryptPassword = {
   encryptPasswrod = function(plainPassword) {
      return plainPassword;
   },
   decryptPassword = function(password) {
      return password;
   },
   comparePassword = function(plainPassword, enPassword) {
      var result = false;
      if(plainPassword === decryptPassword(enPassword)) result true;
      return result;
   }

};

module.exports = cryptPassword;
