var visual = angular.module('visual', ['ngRoute', 'ui.bootstrap']);

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
  link: function(scope,elements){
      $http.get('/dashboards').success(function(json) {
      scope.dashboardItems = json;
      scope.currentTab = json[0].tabId;

      scope.onClickTab = function (tab) {
        scope.currentTab = tab.tabId;
      }

      scope.isActiveTab = function(tabId) {
          return tabId == scope.currentTab;
      }
    });
    $http.get('chartData/widgets').success(function(widgets) {
      scope.widgetItems = widgets;

      scope.widget = function(widgetId) {
        widgets.forEach(function(w) {
           if(w.widgetId === widgetId) {
              scope.title = w.title;
              scope.chartRenderer = w.chartRenderer;
              scope.url = w.url;
              scope.comments = w.comments;
           }
        });
      }
    });
  }
};
});
visual.directive('chartData',['$log','plotNorthEast','plotContinentChart','gdpStackedBarChart','gdpPerCapitaBarChart', function($log,plotNorthEast,plotContinentChart,gdpStackedBarChart,gdpPerCapitaBarChart){
 return {
   restrict:'E',
   templateUrl:'pages/chartData.html',
   replace:true,
   scope:{
     parameter : "@",
     chartRender :"@"
   },
   link: function(scope,elements,attrs){
     $log.log("reached link");
     var chart = scope.chartRender + ".render" +'(elements[0]'+ ','+ elements[0].clientWidth+',"' +scope.parameter + '")';
     eval(chart);

   }
}
}]);
