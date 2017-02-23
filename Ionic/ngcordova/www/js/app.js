// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller('MyCtrl', function($scope, $cordovaDevice) {
  $scope.funcion = function(){
   alert($cordovaDevice.getModel());
  }
}) // si jalo
.controller('control2', function($scope, $cordovaToast) {
  $scope.funcion = function (){
  $cordovaToast.showShortBottom('Here is a message', 'long', 'center')
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });
   }
})
.controller('control3', function($scope, $cordovaAdMob) {
    // AdMob implementation here
    // coming soon...
});

