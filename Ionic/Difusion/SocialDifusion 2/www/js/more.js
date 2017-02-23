angular.module('starter.more', []);

/*app.service('CrearEmpresa', function() {

  var nombre;
  var domicilio;
  var telefono;
  var horario;
  var descripcion;
  var categoria;
  
  this.method1 = function() {
      return loco;
    }

  this.method2 = function() {
      //..
    }
});*/


app.controller('CiudadCtrl',['$scope','$http', function($scope, $http ){
       $http.get('http://192.168.1.72/socialD/app/ciudad.php').success(function(response){
       $scope.ciudades = response;
     });

   $scope.selecionarC = function(idzona, nombreZona){
      window.localStorage['zona'] = idzona;
      var name = window.localStorage['zona'];
      alert('Se selecciono '  + nombreZona);
    };
}]);

app.controller('FastNumberCtrl',['$scope','$http',function($scope, $http){
    $http.get("js/fastNumbers.json").success(function(response) {$scope.fastNumber = response})
}]);


















app.controller('LoginCtrl',['$scope','$http','$state', function($scope, $http ,$state){

     
     $scope.user = {email:"hangtuwlf@gmail.com",password:"1234"};
     
     // HIDE SIGN-IN VIEW
     $scope.view = false;  //view login
     $scope.view2 = true;  //view success

     $scope.signIn = function (user){
         var email = user.email;
         var pass = user.password;
         
         if (typeof email != "undefined"){
            $http.post('http://192.168.1.72/socialD/app/login/login.php',{
              email:email,
              password:pass
            }).success(function(response){
                if(response=="0"){
                   alert("usuario incorrecto");
                }else{
                   $scope.view = true;  //view login
                   $scope.view2 = false;
                   $http.post('http://192.168.1.72/socialD/app/login/companies.php',{
                       idusuario:response[0].idusuario
                   }).success(function(response2){
                       $scope.items = response2;
                   });
                }//end else
            });
         }
     }// end signIn function 
}]);










app.factory('EmpresaService2', function($http){
  
  var BASE_URL = "http://192.168.1.72/socialD/app/momentoE.php";
  var items = [];
  var count=0;
  var empresa;
  var loading=1;
   

  return {
    GetFeed: function(){
      count=0;
      return $http.post(BASE_URL,{
        contador:count,
        idempresa:empresa
      }).then(function(response){
        items = response.data;
        loading=items[0].loading;
        return items;
      });
    },
     GetNewUsers: function(){
      return $http.post(BASE_URL,{
        contador:count,
        idempresa:empresa
      }).then(function(response){
        items = response.data;
        loading=items[0].loading;
        return items;
      });
    },
     GetContador: function (){
         return count++;
     },
     setEmpresa: function(idempresa){
         empresa = idempresa;
     },
     getLoading: function (){
         return loading;
     },
     setLoading: function (){
          loading=1;
     }
  }
});










app.controller('CompanyCtrl',function($scope,$http ,$state, EmpresaService2, $ionicModal, $cordovaSocialSharing ,$cordovaFileTransfer,$cordovaCamera){
     

     $scope.idempresa=$state.params.id;
     EmpresaService2.setLoading();
     EmpresaService2.setEmpresa($state.params.id);
     $scope.user = {comentario:""};

     
     $scope.items = [];
    

     EmpresaService2.GetFeed().then(function(items){
      if(EmpresaService2.getLoading()!="0"){
         $scope.items = items;
        }
    });

  
  $scope.loadMore = function(){
       EmpresaService2.GetContador();
       EmpresaService2.GetNewUsers().then(function(items) {
        if(EmpresaService2.getLoading()!="0"){
          $scope.items = $scope.items.concat(items);
         }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.moreDataCanBeLoaded = function (){
     if(EmpresaService2.getLoading()=="0"){
              return false;
      }else{
              return true;
      }
  }


   $ionicModal.fromTemplateUrl('comentarios.html', {
     scope: $scope,
     animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

  $scope.openModal = function(idmomento,contador) {  //contador  de comentarios 
    $scope.idmomento = idmomento;
    $scope.modal.show();
    $scope.comentario = null; // sin comentarios
     if(contador > 0){
      $http.post("http://192.168.1.72/socialD/app/comentariosM.php",{
        msg:idmomento
      }).success(function(response) {$scope.comentario = response})
     }
   };
  
  $scope.closeModal = function() {
     $scope.user = { 
       comentario:""
     };
     $scope.modal.hide();
  };

    $scope.sendMsg= function (comentario){
     $http.post("http://192.168.1.72/socialD/app/agregarComentario.php",{
        fk_momento:$scope.idmomento,
        comment:comentario
      }).success(function(response) {$scope.comentario = response})
     $scope.closeModal();
  };

   $scope.like = function (index,idmomento){
     $http.post("http://192.168.1.72/socialD/app/likesM.php",{fk_momento:idmomento}).success(function(response){
          if(response.trim()=="LIKE"){
             $scope.items[index].likeCount = parseInt($scope.items[index].likeCount)+1;
             $scope.items[index].color = "positive";
          }else{
             $scope.items[index].likeCount = parseInt($scope.items[index].likeCount)-1;
             $scope.items[index].color = "";
          }
     });
  }

  $scope.compartir = function(){
  $cordovaSocialSharing
    .shareViaFacebook("Android","https://marcelagomez614.files.wordpress.com/2014/02/goodwp-com-17730.jpg") // Share via native share sheet
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }


  $scope.makeid = function(){
    text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

  $scope.dato = $scope.makeid();
  

  $scope.empresaPhoto = function (){  
    var options = {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true,
            allowEdit: true
    };
    $cordovaCamera.getPicture(options).then(
        function(imageURI) {
         $scope.imagens = imageURI;
         var fileURL = imageURI;

         var params = {};
         params.folder = "hilo";
         params.iduser = "1";

        var headers = {};
        headers.Connection = "close";

       var options = {
            fileKey: "foto1", // clave para ser recibida en php
            //fileName: "imagen.png",  // nombre de la imagen que se manda
            chunkedMode: false,
            mimeType: "image/png",
            params: params,
            chunkedMode:false,
            headers:headers
        };

    $cordovaFileTransfer.upload("http://192.168.1.72/socialD/system/companyPhoto.php", fileURL , options , true)
      .then(function(result) {
          alert(result.response);
          $scope.dato = $scope.makeid();
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
   }  // fin de la funcion 

    $scope.perfilPhoto = function (){  
    
    var options = {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true,
            allowEdit: true
    };
    $cordovaCamera.getPicture(options).then(
        function(imageURI) {
         var fileURL = imageURI;


         var params = {};
         params.folder = "hilo";
         params.iduser = "1";

         var headers = {};
         headers.Connection = "close";

       var options = {
            fileKey: "foto1", // clave para ser recibida en php
            //fileName: "imagen.png",  // nombre de la imagen que se manda
            chunkedMode: false,
            mimeType: "image/png",
            params: params,
            chunkedMode:false,
            headers:headers
        };

    $cordovaFileTransfer.upload("http://192.168.1.72/socialD/system/companyPhoto.php", fileURL , options , true)
      .then(function(result) {
          alert(result.response);
          $scope.dato = $scope.makeid();
          $cordovaToast.show('Profile image changed', 'short', 'center');
      }, function(err) {
         $cordovaToast.show("try again :(", 'long', 'center');
      }, function (progress) {
          $ionicLoading.show((progress.loaded / progress.total )* 100);
      });
   }); // cordovaCamera
   }  // fin de la funcion 
});



















app.controller('ChangesCtrl',function($scope,$http, $state){

    $http.post('http://192.168.1.72/socialD/app/login/getCompanyData.php',{
       msg:$state.params.id
    }).success(function(response){
         $scope.empresa = {
            name:response[0].nombre,
            address:response[0].domicilio,
            tel:response[0].telefono,
            desc:response[0].descripcion
            //open:new Date("Wed Mar 25 2015 09:56:24 GMT+0100 (W. Europe Standard Time)")
         }
    });
     
     $scope.guardar = function (empresa){
       
       var GTM = empresa.open.toString().split(" ");
       var timeOpen = GTM[4];

       var GTM = empresa.close.toString().split(" ");
       var timeClose= GTM[4];
       //var timeClose = new Date("2000-11-30T14:00:00.000Z");


        $http.post('http://192.168.1.72/socialD/app/login/changes.php',{
           idempresa:$state.params.id,
           object : empresa,
           timeOpen: timeOpen,
           timeClose: timeClose
        }).success(function(response){
             alert(response);
        });
     }

});

app.controller('RegistroCtrl',function($scope,$state,$http){
     $scope.registrar = function (user){
          var firstName  = user.firstName;
          var lastName = user.lastName;
          var email = user.email;
          var password = user.password;

        if (typeof email != "undefined" && typeof password != "undefined" && firstName != "" && lastName != "" && password != ""){
            $http.post('http://192.168.1.72/socialD/app/login/registrar.php',{
              name:firstName,
              lastName:lastName,
              email:email,
              password:password
            }).success(function(response){
                if(response=="1"){
                   alert("Tu cuenta fue creada");
                  $state.go("tabs.account");
                }else{
                  alert(response);
                }
            });
         }else{
            alert("rellena todos los campos");
         }
     }
});


















