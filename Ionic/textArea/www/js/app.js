angular.module('ionicApp', ['ionic'])

.controller('AppCtrl', function($scope, $ionicModal) {
  $scope.data = {
    itemSubmitted:false,
  }
  $scope.items = [
    { name: 'Cat - Click to edit me', description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus sodales dictum. Integer varius accumsan urna vitae congue. Aliquam lectus urna, dictum id magna vitae, fermentum tempor neque. Vestibulum suscipit, mi eget porta iaculis, eros orci iaculis enim, ac consectetur est diam eu nibh. Sed tincidunt rutrum maximus. Sed feugiat risus urna, et fringilla nulla aliquet et.', image:'http://placekitten.com/350/301' },
    { name: 'Refrigerator', description: 'Like new' , image:'http://placekitten.com/350/302'},
    { name: 'Bowl of Cherries', description:'Rainiers' , image:'http://placekitten.com/350/303'},
  ];

  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.createContact = function(u) {        
    $scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
    $scope.modal.hide();
  };
    
  $scope.item = {};
    
  $scope.editItem = function(item) {
    $scope.modal.show();
    $scope.item = item;
    }  
  $scope.saveItem = function (valid) {
    if(valid){
    console.log($scope.item);
    $scope.items.push($scope.item);
    console.log($scope.items);
      $scope.modal.hide();
    } else {
      $scope.data.itemSubmitted = true;
    }
  };
    
 $scope.cancel = function(){
   $scope.modal.hide();
 }

})
  .directive('textarea', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attr){
        var update = function(){
            element.css("height", "auto");
            var height = element[0].scrollHeight; 
            element.css("height", element[0].scrollHeight + "px");
        };
        scope.$watch(attr.ngModel, function(){
            update();
        });
    }
  };
});