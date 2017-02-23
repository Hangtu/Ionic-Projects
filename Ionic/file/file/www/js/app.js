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
.controller('MyCtrl', function($scope, $timeout, $cordovaFileTransfer,$cordovaCamera ,$ionicLoading,$cordovaToast) {

    

    var url = "http://cdn.wall-pix.net/albums/art-space/00030109.jpg";
    //var targetPath = "/storage/emulated/0/path/to/file/testImage.png";// cambia segun ios o android  
    var trustHosts = true ;
    var options = {};
     
    $scope.descargar = function(){
     var targetPath = cordova.file.documentsDirectory + "testImage.png";

    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
      .then(function(result) {
         alert("ok "+result.toURL());
         $scope.imagen = result.toURL();
      }, function(err) {
        alert("error"+err.code);
      }, function (progress) {
        $timeout(function () {
          $scope.downloadProgress = (progress.loaded / progress.total) * 100;
        })
      });
   }


$scope.abrir = function() { 
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        };

      $cordovaCamera.getPicture(options).then(
        function(imageURI) {
            window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
                $scope.picData = fileEntry.nativeURL;
                $scope.ftLoad = true;
                var image = document.getElementById('myImage');
                image.src = fileEntry.nativeURL;
            });
            $ionicLoading.show({template: 'Foto acquisita...', duration:500});
        },
        function(err){
            $ionicLoading.show({template: 'Errore di caricamento...', duration:500});
        })
    }


  $scope.subir = function (){

    var options = {
            // quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        };

    $cordovaCamera.getPicture(options).then(
        function(imageURI) { // when you choose
        // window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
        // var fileURL = fileEntry.nativeURL;
         var fileURL = imageURI;
        // var fileURL = $scope.picData;
        //var server = "http://192.168.1.73/images/uploads.php";

         var params = {};
         params.dato = "folder";
     // params.value2 = "param";

       var options = {
            fileKey: "file", //equivalente a name  in html
            //fileName: "image.png",
            chunkedMode: false,
            mimeType: "image/png",
            params: params
        };

    $cordovaFileTransfer.upload("http://192.168.1.73/images/uploads.php", fileURL , options)
      .then(function(result) {
         $cordovaToast.show('Imagen de perfil cambiada', 'short', 'center');
      }, function(err) {
         $cordovaToast.show('vuelva a intentarlo', 'long', 'center');
      }, function (progress) {
          $ionicLoading.show((progress.loaded / progress.total )* 100);
      });
           // });
         // $ionicLoading.show({template: 'Foto acquisita...', duration:500});
        },
        function(err){
         // $ionicLoading.show({template: 'Errore di caricamento...', duration:500});
        });
  }
});
