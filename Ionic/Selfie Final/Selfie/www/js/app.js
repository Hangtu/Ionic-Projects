// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic','ngCordova'])

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
.config(function($ionicConfigProvider) {
$ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
$ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
 //$ionicConfigProvider.views.forwardCache(false);
 //$ionicConfigProvider.views.maxCache(1);
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tabs', {  //nombre de la clase padre
    cache : false,
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })
  .state('tabs.momento', { // hijos
    url: '/momento',
    views: {
      'momento-tab': {
        templateUrl: 'templates/momento.html',
        controller: 'MomentoCtrl'
      }
    }
  })
  .state('tabs.momento_detail', { // hijos
    url: '/momento/:id',
    views: {
      'momento-tab': {
        templateUrl: 'templates/momento_detail.html',
        controller: 'MomentoDetailCtrl'
      }
    }
  })
  .state('tabs.more', { // hijos
    url: '/more',
    views: {
      'more-tab': {
        templateUrl: 'templates/more.html',
        controller: 'LoginCtrl'
      }
    }
  }).state('tabs.more_about', { // hijos
    url: '/more/about',
    views: {
      'more-tab': {
        templateUrl: 'templates/about.html'
      }
    }
  }).state('tabs.login', { // hijos
    url: '/more/login',
    views: {
      'more-tab': {
        cache : false,
        templateUrl: 'templates/login.html',
        controller:'AppCtrl'
      }
    }
  })
  $urlRouterProvider.otherwise('tab/momento');
});




app.controller('MomentoDetailCtrl',['$scope','$http','$state', function($scope, $http ,$state){
    $scope.iduserm = $state.params.id;
    $http.post("http://www.newdifusion.com/SelfieServer/php/app/user_detail.php",{
     msg:$scope.iduserm
    }).success(function(response) {
      $scope.user_detail = response;
      $scope.profile_img = response[0].image_profile+"?"+$scope.makeid();
    })
  
   $scope.abrir = function(dato){
      $scope.url = dato;
      inAppBrowser = window.open($scope.url, '_blank', 'location=yes');
    }

   $scope.makeid = function(){
     text = "";
     var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

     for( var i=0; i < 5; i++ )
     text += possible.charAt(Math.floor(Math.random() * possible.length));

     return text;
  }
}]);





app.factory('PersonService', function($http){
  var BASE_URL = "http://www.newdifusion.com/SelfieServer/php/app/user.php";
  var items = [];
  
  return {
    GetFeed: function(){
      return $http.get(BASE_URL).then(function(response){
        items = response.data;
        return items;
      });
    },
    GetNewUsers: function(){
      return $http.get(BASE_URL).then(function(response){
        items = response.data;
        return items;
      });
    }
  }
});



app.controller('MomentoCtrl', function($scope, $timeout, PersonService) {
  
  $scope.items = [];
  
  PersonService.GetFeed().then(function(items){
  $scope.items = items;
  //$scope.logo = $scope.makeid();
  });

 $scope.makeid = function(){
    text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
  $scope.datos = $scope.makeid();
  
  $scope.loadMore = function(){
    PersonService.GetNewUsers().then(function(items) {
      $scope.items = $scope.items.concat(items);
    
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
});










app.controller('LoginCtrl', function($scope, $location , $http, $cordovaToast) {
   

   $scope.login = function(user){

     $scope.email = user.email;
     $scope.pass = user.pass;

     $http.post("http://www.newdifusion.com/SelfieServer/php/app/login.php",{
       email:$scope.email, pass:$scope.pass}).success(function(response){ 
        //$scope.firstPassword = "mali";
           var res = response.trim();
           if (res == "mal"){
               $cordovaToast.show("User or password incorrect", 'long', 'center');
          
           }else{
          window.localStorage['id'] = response;
          $location.path('/tab/more/login');
        }
    }).
      error(function(data) {
      alert("Error");
    });  
          //alert(angular.equals("mal", $scope.secondPassword));
   }
});



app.controller('AppCtrl', function($scope,$location,$http,$cordovaToast,$cordovaFileTransfer,$cordovaCamera,$state,$ionicLoading){
    
   $scope.makeid = function(){
    text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
  
       return text;
    }


    var id = window.localStorage['id'];
    $http.post("http://www.newdifusion.com/SelfieServer/php/app/dentro.php",{
       msg:id}).success(function(response){ 

         $scope.name = response[0].name;
         $scope.surname = response[0].surname; 

         $scope.occupation = response[0].occupation;
         $scope.phrase = response[0].phrase;
         $scope.hobbies = response[0].hobbies;
         $scope.facebook = response[0].facebook;
         $scope.twitter = response[0].twitter;

         $scope.profiles = response[0].image_profile+"?"+$scope.makeid(); 
         $scope.selfie = response[0].image_selfie+"?"+$scope.makeid();
         $scope.folder = response[0].folder;  

         $scope.views = response[0].views;       
    }).
      error(function(data) {
      alert("Error");
    }); 

    $scope.guardar = function (phrase,hobbies,occupation,facebook,twitter){

    $http.post("http://www.newdifusion.com/SelfieServer/php/app/changes.php",{
       iduser:id,
       occupation:occupation,
       phrase:phrase,
       hobbies:hobbies,
       facebook:facebook,
       twitter:twitter
     }).success(function(response){ 
        $cordovaToast.show('done!', 'long', 'bottom');
        //$state.go($state.current, {}, {reload: true});
        //$state.go('tabs.momento');
       }).error(function(data) { 
          alert("error"+data);
       });

    }//fin funcion


   $scope.subir = function (){

        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true,
            allowEdit: true,
            Connection: "close"
        };

    $cordovaCamera.getPicture(options).then(
        function(imageURI) { // when you choose
        // window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
        // var fileURL = fileEntry.nativeURL;
         var fileURL = imageURI;
        // var fileURL = $scope.picData;
        //var server = "http://192.168.1.73/images/uploads.php";

         var params = {};
         params.folder = $scope.folder;
         params.iduser = id;
     // params.value2 = "param";

       var options = {
            fileKey: "foto1", //equivalente a name  in html
            //fileName: "image.png",
            chunkedMode: false,
            mimeType: "image/png",
            params: params
        };

    $cordovaFileTransfer.upload("http://www.newdifusion.com/SelfieServer/php/app/profile_image.php", fileURL , options)
      .then(function(result) {
        $state.go('tabs.momento');
         $cordovaToast.show('Profile image changed', 'short', 'center');
      }, function(err) {
         $cordovaToast.show("try again :(", 'long', 'center');
      }, function (progress) {
          $ionicLoading.show((progress.loaded / progress.total )* 100);
      });
           // });
         // $ionicLoading.show({template: 'Foto acquisita...', duration:500});
        },
        function(err){
         // $ionicLoading.show({template: 'Errore di caricamento...', duration:500});
        });
  }  // fin de la funcion abrir


  $scope.subir2 = function (){

        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true,
            //targetWidth:1200, 
            //targetHeight:1200,
            allowEdit: true,
            Connection: "close"
        };

    $cordovaCamera.getPicture(options).then(
        function(imageURI) { // when you choose
        // window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
        // var fileURL = fileEntry.nativeURL;
         var fileURL = imageURI;
        // var fileURL = $scope.picData;
        //var server = "http://192.168.1.73/images/uploads.php";

         var params = {};
         params.folder = $scope.folder;
         params.iduser = id;
     // params.value2 = "param";

       var options = {
            fileKey: "foto1", //equivalente a name  in html
            //fileName: "image.png",
            chunkedMode: false,
            mimeType: "image/png",
            params: params
        };

    $cordovaFileTransfer.upload("http://www.newdifusion.com/SelfieServer/php/app/selfie_image.php", fileURL , options)
      .then(function(result) {
        $state.go('tabs.momento');
          //$state.go('tabs.momento');
         $cordovaToast.show('Selfie image changed', 'short', 'center');
      }, function(err) {
         $cordovaToast.show("try again :(", 'long', 'center');     
      }, function (progress) {
          $ionicLoading.show((progress.loaded / progress.total )* 100);
          $cordovaToast.show(progress.loaded, 'long', 'center');
      });
           // });
         // $ionicLoading.show({template: 'Foto acquisita...', duration:500});
        },
        function(err){
         // $ionicLoading.show({template: 'Errore di caricamento...', duration:500});
        });

  }  // fin de la funcion abrir

  });





