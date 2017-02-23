angular.module('ionicApp', ['ionic'])

.factory('PersonService', function($http){
	var BASE_URL = "http://api.randomuser.me/";
	var items = [];
	
	return {
		GetFeed: function(){
			return $http.get(BASE_URL+'?results=10').then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetNewUsers: function(){
			return $http.get(BASE_URL+'?results=10').then(function(response){
				items = response.data.results;
				return items;
			});
		}
	}
})

.controller('MyCtrl', function($scope, $timeout, PersonService) {
  $scope.items = [];
  
  PersonService.GetFeed().then(function(items){
	$scope.items = items;
  });
  
  $scope.loadMore = function(){
    PersonService.GetNewUsers().then(function(items) {
      $scope.items = $scope.items.concat(items);
	  
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
  
});