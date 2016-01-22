var visual = angular.module('visual', ['ngRoute', 'ui.bootstrap', 'MyApp']);

visual.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'pages/home.html'
    });
}]);

visual.directive('dashTab', function($rootScope,$http){
return {
  restrict:'E',
  templateUrl:'pages/dashTab.html',
  controller: function(){
    $http.get('/tabs').success(function(data) {
      $rootScope.dashboards = data.dashboards;
      $rootScope.currentTab = data.dashboards[0].tabId;

      $rootScope.onClickTab = function (tab) {
          $rootScope.currentTab = tab.tabId;
      }

      $rootScope.isActiveTab = function(tabId) {
          return tabId == $rootScope.currentTab;
      }

      $rootScope.username = data.name;
    });
  }
};
});

visual.directive('dashBoard', function($rootScope,$http){
 return {
   restrict:'E',
   templateUrl:'pages/dashboard.html',
   replace:true,
  controller: function(){
      $http.get('/dashboards').success(function(json) {
      $rootScope.dashboardItems = json;
      $rootScope.currentTab = json[0].tabId;

      $rootScope.onClickTab = function (tab) {
          $rootScope.currentTab = tab.tabId;
      }

      $rootScope.isActiveTab = function(tabId) {
          return tabId == $rootScope.currentTab;
      }
    });
  }
};
});
