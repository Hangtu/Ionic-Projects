// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic','starter.mapas','starter.more','ngCordova'])

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
window.localStorage['zona'] = 1; // zona inicial
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('tabs', {  //Clase Padre Del Contenido
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    controller:'TablesCtrl'
  })
  .state('tabs.categorias', { // hijos
    url: '/categorias',
    views: {
      'categorias-tab': {
        templateUrl: 'templates/categorias.html'
      }
    }
  })
  .state('tabs.buscar', { // hijos
    url: '/buscar',
    views: {
      'categorias-tab': {
        templateUrl: 'templates/buscar.html',
        controller: 'SearchCtrl'
      }
    }
  })
    .state('tabs.categorias_detail', { // hijos
    url: '/categorias/:id',
    views: {
      'categorias-tab': {
        templateUrl: 'templates/categorias_detail.html',
        controller: 'CategoriaDetailCtrl'
      }
    }
  })
  .state('tabs.premium', { // hijos
    url: '/premium/:id',
    views: {
      'categorias-tab': {
        templateUrl: 'templates/categorias_detail.html',
        controller: 'PremiumCtrl'
      }
    }
  })
  .state('tabs.empresa', { // hijos
    url: '/empresa/:id',
    views: {
      'categorias-tab': {
        templateUrl: 'templates/empresa.html',
        controller: 'EmpresaCtrl'
      }
    }
  })
  .state('tabs.comentario', { // hijos
    url: '/comentario/:id',
    views: {
      'categorias-tab': {
        templateUrl: 'templates/empresa_comments.html',
        controller: 'ComentarioCtrl'
      }
    }
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
        templateUrl: 'templates/empresa.html',
        controller: 'EmpresaCtrl'
      }
    }
  })
  .state('tabs.more', {  // MAS TAB
    url: '/more',
    views: {
      'more-tab': {
        templateUrl: 'templates/more.html'
        //controller: 'listController'
      }
    }
  })
  .state('tabs.ciudad', { // hijos
    url: '/ciudad',
    views: {
      'more-tab': {
        templateUrl: 'templates/more_ciudad.html',
        controller: 'CiudadCtrl'
      }
    }
  })
  .state('tabs.fastNumber', { // hijos
    url: '/fastNumber',
    views: {
      'more-tab': {
        templateUrl: 'templates/more_fastNumber.html',
        controller: 'FastNumberCtrl'
      }
    }
  }).state('tabs.account', { // ACCOUNT TAB
    url: '/account',
    views: {
      'account-tab': {
        templateUrl: 'login/sign-in.html',
        controller: 'LoginCtrl'
      }
    }
  }).state('tabs.company', {
    url: '/company/:id',
     views: {
      'account-tab': {
        templateUrl: 'login/company.html',
        controller: 'CompanyCtrl'
      }
    }
  }).state('tabs.changes', {
    url: '/changes/:id',
     views: {
      'account-tab': {
        templateUrl: 'login/changes.html',
        controller: 'ChangesCtrl'
      }
    }
  }).state('tabs.registro', { // ACCOUNT TAB
    url: '/registro',
    views: {
      'account-tab': {
        templateUrl: 'login/registro.html',
        controller: 'RegistroCtrl'
      }
    }
  })
  $urlRouterProvider.otherwise('tab/momento');
});


app.controller('TablesCtrl',['$scope','$http', function($scope, $http){
  /* $scope.SayHello = function() {
    alert('hello');
  }
  $scope.SayBye = function() {
    alert('Bye');
  }*/
}]);



app.factory('CategoriaService', function($http){
  var BASE_URL = "http://192.168.1.72/socialD/app/categoria.php";
  var items = [];
  var count=0;
  var categoria; // categoria
  var loading=1;
   

  return {
    GetFeed: function(){
      count=0;
      return $http.post(BASE_URL,{
        contador:count,
        idcategoria:categoria,
        zona:window.localStorage['zona']
      }).then(function(response){
        items = response.data;
        loading=items[0].loading;
        return items;
      });
    },
     GetNewUsers: function(){
      return $http.post(BASE_URL,{
        contador:count,
        idcategoria:categoria,
        zona:window.localStorage['zona']
      }).then(function(response){
        items = response.data;
        loading=items[0].loading;
        return items;
      });
    },
     GetContador: function (){
         return count++;
     },
     setCategoria: function(idcategoria){
         categoria = idcategoria;
     },
     getLoading: function (){
         return loading;
     },
     setLoading: function (){
          loading=1;
     }
  }
});





app.controller('SearchCtrl',['$scope','$http', function($scope, $http){
  $scope.buscar = function (name){
    $http.post("http://192.168.1.72/socialD/app/search.php",{
     nombre:name,
     city:window.localStorage['zona']
    }).success(function(response) {$scope.busqueda = response})
  }
}]);

app.controller('PremiumCtrl',['$scope','$http','$state', function($scope, $http ,$state){
    $scope.idcategoria = $state.params.id;
    $http.post("http://192.168.1.72/socialD/app/premium.php",{
    zona:window.localStorage['zona']//muestra las empresas segun la zona seleccionada en opciones
    }).success(function(response) {$scope.items = response})
}]);


app.controller('CategoriaDetailCtrl',['$scope','$http','$state','CategoriaService', function($scope, $http ,$state,CategoriaService){
     
  $scope.idcategoria = $state.params.id;
  CategoriaService.setCategoria($state.params.id);
  CategoriaService.setLoading();
  

  $scope.items = [];
   CategoriaService.GetFeed().then(function(items){
    if(CategoriaService.getLoading()!=0){
      $scope.items = items;
     }
  });

  
   $scope.loadMore = function(){
      CategoriaService.GetContador();
      CategoriaService.GetNewUsers().then(function(items) {
      if(CategoriaService.getLoading()!=0){
         $scope.items = $scope.items.concat(items);
       }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

   $scope.moreDataCanBeLoaded = function (){
     if(CategoriaService.getLoading()=="0"){
              return false;
      }else{
              return true;
      }
  }

}]);





















// EMPRESA EMPRESA EMPRESA EMPRESA EMPRESA EMPRESA


app.factory('EmpresaService', function($http){
  
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




app.controller('EmpresaCtrl',['$scope','$http','$state','EmpresaService','$ionicModal','$cordovaSocialSharing',function($scope, $http ,$state, EmpresaService, $ionicModal, $cordovaSocialSharing){ 
   

    EmpresaService.setLoading();
    $scope.idempresa = $state.params.id;
    EmpresaService.setEmpresa($state.params.id);
   $http.post("http://192.168.1.72/socialD/app/empresa.php",{
    msg:$scope.idempresa
    }).success(function(response) {
      $scope.empresa = response;
      window.localStorage['empresa'] = $scope.empresa[0].idempresa; // datos para enviar a opciones.
      window.localStorage['carpeta'] = $scope.empresa[0].carpeta;  // Imagenes y Mapa.
    });


  $scope.items = [];
  EmpresaService.GetFeed().then(function(items){
   if(EmpresaService.getLoading()!="0"){
    $scope.items = items;
   }
  });

  
  $scope.loadMore = function(){
      EmpresaService.GetContador();
      EmpresaService.GetNewUsers().then(function(items) {
     if(EmpresaService.getLoading()!="0"){
      $scope.items = $scope.items.concat(items);
       }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
      
  $scope.moreDataCanBeLoaded = function (){
     if(EmpresaService.getLoading()=="0"){
              return false;
      }else{
              return true;
      }
  }
   $scope.user = {comentario:""};
   $ionicModal.fromTemplateUrl('comentarios.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(idmomento,contador) {
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
    $scope.user = {comentario:""};
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


}]);

// Opciones Dentro De Empresa 

app.controller('ImagenCtrl',['$scope','$http','$state', function($scope, $http ,$state){
    $http.post("http://192.168.1.72/socialD/app/galeria.php",{
     carpeta:window.localStorage['carpeta']
    }).success(function(response) {$scope.imagenes = response})
    $scope.carpeta=window.localStorage['carpeta'];
}]);

app.controller('ComentarioCtrl',['$scope','$http','$state', function($scope, $http ,$state){
    $scope.idempresa = $state.params.id;
    $http.post("http://192.168.1.72/socialD/app/comentarios.php",{
     msg:$scope.idempresa
    }).success(function(response) {$scope.comentario = response})
}]);


// EDITANDO






















 //MOMENTO MOMENTO MOMENTO MOMENTO

app.factory('PersonService', function($http){
  var BASE_URL = "http://192.168.1.72/socialD/app/momento.php";
  var items = [];
  var count=0;
  var loading=1;
   

  return {
    GetFeed: function(){
      count=0;
      return $http.post(BASE_URL,{
        contador:count,
        city:window.localStorage['zona']
      }).then(function(response){
        items = response.data;
        loading=items[0].loading;
        return items;
      });
    },
     GetNewUsers: function(){
      return $http.post(BASE_URL,{
        contador:count,
        city:window.localStorage['zona']
      }).then(function(response){
        items = response.data;
        loading=items[0].loading;
        return items;
      });
    },
     GetContador: function (){
         return count++;
     },
     GetLoading: function (){
         return loading;
     },
     SetLoading: function (){
          loading=1;
     }
  }
});

app.controller('MomentoCtrl',['$scope','$http','$state','PersonService','$ionicModal','$cordovaSocialSharing',function($scope, $http ,$state, PersonService, $ionicModal,$cordovaSocialSharing){
  
  $scope.items = [];
  $scope.user = {comentario:""};

  PersonService.SetLoading();
  
  PersonService.GetFeed().then(function(items){
  if(PersonService.GetLoading()!="0"){ 
    $scope.items = items;
  }
  });

  
  $scope.loadMore = function(){
      PersonService.GetContador();
      PersonService.GetNewUsers().then(function(items) {
        if(PersonService.GetLoading()!="0"){ 
           $scope.items = $scope.items.concat(items);
        }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

   $scope.compartir = function(){
  $cordovaSocialSharing
    .shareViaFacebook("Android","https://marcelagomez614.files.wordpress.com/2014/02/goodwp-com-17730.jpg") // Share via native share sheet
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }

  $ionicModal.fromTemplateUrl('comentarios.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(idmomento,contador) {
    $scope.idmomento = idmomento;
    $scope.modal.show();
    $scope.comentario = null; // sin comentario
     if(contador > 0){
      $http.post("http://192.168.1.72/socialD/app/comentariosM.php",{
        msg:idmomento
      }).success(function(response) {$scope.comentario = response})
     }
   };
  $scope.closeModal = function() {
    $scope.user = {comentario:""};
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

 $scope.doRefresh = function() {
     $state.go($state.current, {}, {reload: true});
  };

  $scope.moreDataCanBeLoaded = function (){
     if(PersonService.GetLoading()=="0"){
              return false;
      }else{
              return true;
      }
  }
}]);




