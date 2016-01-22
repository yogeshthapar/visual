angular.module('visual').controller('homeController', function($scope, $http, $log, ChartService) {

  // $scope.$watch('data', function(){
  //              $scope.render($scope.data);
  //          }, true);
  $http.get('chartData/widgets').success(function(widgets) {
    $scope.widgetItems = widgets;

    $scope.widget = function(widgetId, widgetContainer) {
      widgets.forEach(function(w) {
         if(w.widgetId === widgetId) {
            $scope.title = w.title;
            $scope.chartRenderer = w.chartRenderer;
            $scope.url = w.url;
            $scope.comments = w.comments;
            ChartService[$scope.chartRenderer]("#" + widgetContainer,500, $scope.url);
         }
      });
    }
  });
});
