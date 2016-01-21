var visualApp = angular.module('visualApp', ['ngRoute', 'ui.bootstrap', 'MyApp']);

visualApp.directive('dashTabs',function() {
  return{
    restrict : 'EAC',
    templateUrl :'pages/dashTabs.html',
    replace : true
  };

});
