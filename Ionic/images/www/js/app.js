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
});


app.controller('HomeController', function($rootScope, $scope, $cordovaCamera, $ionicActionSheet, $cordovaFileTransfer){
    // open PhotoLibrary
    $scope.openPhotoLibrary = function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {

            //console.log(imageData);
            //console.log(options);   
            var image = document.getElementById('tempImage');
            image.src = imageData;  

            var server = "http://192.168.1.73/images/upload.php",
                filePath = imageData;

            var date = new Date();

            var options = {
                fileKey: "file",
                fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
                chunkedMode: false,
                mimeType: "image/jpg"
            };

            $cordovaFileTransfer.upload(server, filePath, options).then(function(result) {
                console.log("SUCCESS: " + JSON.stringify(result.response));
                console.log('Result_' + result.response[0] + '_ending');
                alert("success");
                alert(JSON.stringify(result.response));

            }, function(err) {
                alert("ERROR: " + JSON.stringify(err));
                alert(JSON.stringify(err));
            }, function (progress) {
                // constant progress updates
            });


        }, function(err) {
            alert("Error");
            console.log(err);
        });
    }
});

app.controller('CameraCtrl',['$scope', '$cordovaCamera', '$ionicLoading', '$cordovaFileTransfer',function ($scope, $cordovaCamera, $ionicLoading, $cordovaFileTransfer) {
    $scope.data = { "ImageURI" :  "Select Image" };
    $scope.takePicture = function() {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URL,
        sourceType: Camera.PictureSourceType.CAMERA
      };
      $cordovaCamera.getPicture(options).then(
        function(imageData) {
            $scope.picData = imageData;
            $scope.ftLoad = true;
            //$localstorage.set('fotoUp', imageData);
             window.localStorage['fotoUp'] = imageData;
            $ionicLoading.show({template: 'Foto acquisita...', duration:500});
        },
        function(err){
            $ionicLoading.show({template: 'Errore di caricamento...', duration:500});
            })
      }

      $scope.selectPicture = function() { 
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
    };

    $scope.uploadPicture = function() {
        $ionicLoading.show({template: 'Sto inviando la foto...'});
        var fileURL = $scope.picData;
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.chunkedMode = true;

        var params = {};
        params.value1 = "someparams";
        params.value2 = "otherparams";

        options.params = params;

        var ft = new FileTransfer();
        ft.upload(fileURL, encodeURI("http://192.168.1.73/images/uploads.php"), viewUploadedPictures, function(error) {$ionicLoading.show({template: 'Errore di connessione...'});
        $ionicLoading.hide();}, options);
    }

    var viewUploadedPictures = function() {
        $ionicLoading.show({template: 'Sto cercando le tue foto...'});
        server = "http://192.168.1.73/images/uploads.php";
        if (server) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState === 4){
                    if (xmlhttp.status === 200) {                    
                //document.getElementById('server_images').innerHTML = xmlhttp.responseText;
                    }
                    else { $ionicLoading.show({template: 'Errore durante il caricamento...', duration: 1000});
                    return false;
                    }
                }
            };
            xmlhttp.open("GET", server , true);
            xmlhttp.send()} ;
        $ionicLoading.hide();
    }

    $scope.viewPictures = function() {
        $ionicLoading.show({template: 'Sto cercando le tue foto...'});
        server = "http://192.168.1.73/images/uploads.php";
        if (server) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState === 4){
                    if (xmlhttp.status === 200) {                    
                document.getElementById('server_images').innerHTML = xmlhttp.responseText;
                    }
                    else { $ionicLoading.show({template: 'Errore durante il caricamento...', duration: 1000});
                    return false;
                    }
                }
            };
            xmlhttp.open("GET", server , true);
            xmlhttp.send()} ;
        $ionicLoading.hide();
    }
}]);



