var visual = angular.module('visual', ['ngRoute', 'ui.bootstrap', 'MyApp']);

visual.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'pages/home.html',
      controller :'homePageController'
    });
}]);

visual.controller('homePageController',['$scope','$http', function($scope,$http){

 var fetchTab = function(){
   $http.get('/tabs').success(function(data){
     $scope.tabTitle= data.dashboards;
     console.log($scope.tabTitle);
   });

};

}]);

visual.directive('tabData',function(){
  return{
    restrict:'EACM',
    templateUrl: 'pages/home.html',
    replace : true,
    scope :{
      tabObject :'=',
      fetchTabData : '&'
    },
    link: function(scope, elements, attrs) {

        console.log('Linking...');

        console.log(scope);

        console.log (scope.tabObject) ;


        console.log(elements);

     }

  }
});
