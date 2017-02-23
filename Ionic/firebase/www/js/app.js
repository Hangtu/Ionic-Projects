// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic','firebase']);

var firebase = null;

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
      firebase = new Firebase("https://fireionic.firebaseio.com/");
  });
});

app.config(function($stateProvider,$urlRouterProvider){
   $stateProvider
    .state("login",{
      url:"/login",
      templateUrl:"templates/login.html",
      controller:"LoginCtrl"
    })
    .state("todo",{
      url:"/todo",
      templateUrl:"templates/todo.html",
      controller:"TodoCtrl"
    });
    $urlRouterProvider.otherwise("/login");
});


app.controller('LoginCtrl',function($scope, $firebaseAuth, $location){
      
       $scope.login = function(name, pass){
          var fbAuth = $firebaseAuth(firebase);
          fbAuth.$authWithPassword({
             email:name,
             password:pass
          }).then(function(response){
              $location.path("/todo");
          }).catch(function(error){
              alert("error:"+error);
          });
       }

        $scope.register = function(username, password) {
        var fbAuth = $firebaseAuth(firebase);
        fbAuth.$createUser({email: username, password: password}).then(function() {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {
            $location.path("/todo");
        }).catch(function(error) {
            console.error("ERROR " + error);
        });
    }
});


app.controller('TodoCtrl',function($scope, $firebase, $ionicPopup){

  $scope.list = function (){
     var fbAuth = firebase.getAuth();
     if(fbAuth){
        var sync  = $firebase(firebase.child("users/"+ fbAuth.uid));
        var syncObject =  sync.$asObject();
        syncObject.$bindTo($scope, "data");
     }
  }

$scope.create = function() {
    $ionicPopup.prompt({
        title: 'Enter a new TODO item',
        inputType: 'text'
    })
    .then(function(result) {
        if(result !== "") {
            if($scope.data.hasOwnProperty("todos") !== true) {
                $scope.data.todos = [];
            }
            $scope.data.todos.push({title: result});
        } else {
            console.log("Action not completed");
        }
    });
}

});




















