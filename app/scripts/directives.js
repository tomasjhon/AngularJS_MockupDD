var Directiva = angular.module('directivas', [])

/**
Dependiendo del operador que se le envie, será su comportamiento
**/
Directiva.chooseOperBehaviour = function (operAndParam, $location) {
  var param = operAndParam.split(" ");
  var operation = param[0];
  if (operation == "pathParam") {
    var regExp = /\(([^)]+)\)/;
    var matches = regExp.exec(param[1]);
    //proceso con expresion regular el pathparam resultado queda en posicion 1
    paramPosition = matches[1];
    //separo url en partes
    var params = $location.path().split("/");
    //saco el id por posicion enviada por el pathParam
    return params[paramPosition];
  } else {
    console.log("Funcion no implementada");
  }
}

/**
Actualiza el $state actual, es como hacer un state.reload,  segun los valores del location sera el state que recargemos
**/
Directiva.reload = function ($state, $location) {
  var params = {};
  var state = Directiva.chooseOperBehaviour("pathParam (1)", $location);
  var id = Directiva.chooseOperBehaviour("pathParam (2)", $location);

  if (id !== undefined) {
    params[0] = id;
  } else {
    params = {};
  }

  $state.go(state, params, { reload: true });
}

/**
Devuelve un objeto de una colección usando Id del objeto
**/
Directiva.directive("mockupddGetDataWithId", ['storageSvc', '$location', '$stateParams', '$rootScope', 'configuracionGlobal', 'persistencia', function (storageSvc, $location, $stateParams, $rootScope, configuracionGlobal, persistencia) {
  return {
    scope: {
      data: '='
    },
    link: function (scope, element, attr) {
      var parts = attr.mockupddGetDataWithId.split(" in ");
      var objeto = parts[0];
      var secondPart = parts[1].split(" withId ");
      var collection = secondPart[0];
      var operAndParam = secondPart[1];

      var id = $stateParams[0];
      elem = storageSvc.getData(collection, id);
      scope.data = elem[0];

      persistencia.__mockupLastSaved[objeto] = angular.copy(elem[0]);
    }
  }
}])

/**
Permite crear un objeto, definiendo automaticamente su identificador unico, el usuario definira mediante la interfaz el resto de sus atributos
**/
Directiva.directive("mockupddCreateDataWithId", ['storageSvc', '$location', 'persistencia', 'uuid4', function (storageSvc, $location, persistencia, uuid4) {
  return {
    scope: {
      data: '='
    },
    link: function (scope, element, attr) {
      var parts = attr.mockupddCreateDataWithId.split(" in ");
      var newObject = parts[0];
      var collection = parts[1];

      if (!scope[newObject]) {
        scope[newObject] = {};
      }

      if (typeof (persistencia.__mockupLastSaved[newObject]) !== "undefined") {
        scope[newObject].id = persistencia.__mockupLastSaved[newObject].id;
        scope[newObject].name = persistencia.__mockupLastSaved[newObject].name;

        scope.data = scope[newObject];
        persistencia.__mockupLastSaved[newObject] = scope[newObject];

      } else {
        scope[newObject].id = uuid4.generate();
        scope.data = scope[newObject];

        persistencia.__mockupLastSaved[newObject] = scope[newObject];
      }

    }
  }
}])

/**
Devuelve todos los datos de una colección asociados a un objeto de otra colección,
**/
Directiva.directive("mockupddGetDataAssociated", ['storageSvc', 'persistencia', function (storageSvc, persistencia) {
  return {
    scope: {
      data: '='
    },
    link: function (scope, element, attr) {
      var parts = attr.mockupddGetDataAssociated.split(" associatedWith ");
      var collection1 = parts[0];
      var collection2 = parts[1];
      scope.$watch('persistencia', function (newValue, oldValue) {
        if (typeof (persistencia) !== "undefined") {
          id = persistencia.__mockupLastSaved[collection2].id;
          scope.data = storageSvc.getAssociated_(id, collection1);
        } else {
          console.log("Object no definido.");
        }
      })
    }
  }
}])

/**
Devuelve todos los objetos de una colección
**/
Directiva.directive("mockupddGetData", ['storageSvc', function (storageSvc) {
  return {
    scope: {
      data: '=',
    },
    link: function (scope, element, attr) {
      var collectionName = attr.mockupddGetData;
      scope.data = storageSvc.getAll(collectionName);
    }
  }
}])

/**
Genera ID aleatorio y unico
**/
Directiva.uniqueID = function () {
  function genRand() {
    return Math.random().toString(16).slice(-4);
  }
  return genRand() + '-' + genRand() + '-' + genRand() +
    '-' + genRand() + '-' + genRand() + genRand();
}

/**
Guarda objeto asociado a otro tomando el Id de la URL del navegador
**/
/*Directiva.directive("mockupddSaveAssociated",['$state','storageSvc','$location', function($state,storageSvc,$location) {
  return {
    link: function(scope, element, attr) {
      var parts = attr.mockupddSaveAssociated.split(" to ");
      var newObject = parts[0];
      var secondPart = parts[1].split(" associatedWith ");
      tempCollection = secondPart[0];
      operAndParam = secondPart[1];

      if (!scope[newObject]) {
        scope[newObject] = {};
      }
      $(element).on("click", function() {
        scope.$apply(function() {
        var id = Directiva.chooseOperBehaviour(operAndParam,$location);
        var collection = [];
        collection = storageSvc.getAll(tempCollection);
        scope[newObject].foreignId = id;
        collection.push(angular.copy(scope[newObject]));
        storageSvc.postTemp(tempCollection,collection);
        scope[newObject] = {};
        Directiva.reload($state,$location);
        })
      })
    }
  }
}])
*/

/**
Retorna la cantidad de objetos relacionados de una coleccion con otra, para hacerlo recibimos el nombre de una coleccion y el id foraneo que representa la asociacion
**/
Directiva.directive("mockupddGetDataAssociatedCount", ['$state', 'storageSvc', '$location', 'persistencia', '$rootScope', function ($state, storageSvc, $location, persistencia, $rootScope) {
  return {
    scope: {
      data: '=',
    },
    link: function (scope, element, attr) {
      var parts = attr.mockupddGetDataAssociatedCount.split(" which ");
      var collectionName = parts[0];
      var id = parts[1];
      var acum = 0;

      var collection = [];
      collection = storageSvc.getAll(collectionName);

      for (var i = 0; i < collection.length; i++) {
        if (id == collection[i].foreignId) {
          acum++;
        }
      }

      scope.data = acum;
    }
  }
}])

/**
Asocia objeto a otro objeto tomando como referencia un identificador del objeto que queremos asociar y la coleccion donde sera asociado
Esta directiva la usamos generalmente en una vista donde tenemos una lista de objetos y no sabemos cual el usuario desea asociar
por ejemplo una lista de publicacion donde el usuario puede darle click y hacer un like en alguna publicacion lo que llevara a asociar ese like a dicha publicacion
**/
Directiva.directive("mockupddSaveOrUpdate", ['$state', 'storageSvc', '$location', 'persistencia', '$rootScope', 'uuid4', function ($state, storageSvc, $location, persistencia, $rootScope, uuid4) {
  return {
    scope: {
      data: '=',
    },
    link: function (scope, element, attr) {
      var parts = attr.mockupddSaveOrUpdate.split(" which ");
      var collectionName = parts[0];
      var id = parts[1];
      var acumAdd = 0;

      $(element).on("click", function () {
        scope.$apply(function () {
          var collection = [];
          collection = storageSvc.getAll(collectionName);

          var objeto = {
            id: uuid4.generate(),
            foreignId: id,
            user: $rootScope.loggedUser,
            date: new Date()
          };

          if (collection.length == 0) {
            collection.push(angular.copy(objeto));
            storageSvc.post(collectionName, collection);
          } else {
            var sw = false;
            for (var i = 0; i < collection.length; i++) {
              if (objeto.foreignId == collection[i].foreignId && objeto.user == collection[i].user) {
                console.log("Relacion Ya existe");
                sw = true;
                break;
              } else {

              }
            }
            if (!sw) {
              collection.push(angular.copy(objeto));
              storageSvc.post(collectionName, collection);
            }
          }

          for (var i = 0; i < collection.length; i++) {
            if (objeto.foreignId == collection[i].foreignId) {
              acumAdd++;
            }
          }

          scope.data = acumAdd;
          acumAdd = 0;
        })
      })
    }
  }
}])

/**
Guarda o Actualizada objeto en una coleccion
**/
Directiva.directive("mockupddSave", ['$state', 'storageSvc', '$location', 'persistencia', '$rootScope', 'uuid4', function ($state, storageSvc, $location, persistencia, $rootScope, uuid4) {
  return {
    link: function (scope, element, attr) {
      var parts = attr.mockupddSave.split(" whichBelongsTo ");
      var newObjectName = parts[0];
      var collectionName = parts[1];

      $(element).on("click", function () {
        scope.$apply(function () {
          var collection = [];
          collection = storageSvc.getAll(collectionName);

          if (typeof (scope[newObjectName].id) !== "undefined") {
            for (var i = 0; i < collection.length; i++) {
              if (scope[newObjectName].id == collection[i].id) {
                var index = i; break;
              }
            }

            if (typeof (index) !== "undefined")
              collection.splice(index, 1);

            collection.push(angular.copy(scope[newObjectName]));
            storageSvc.put(collectionName, collection);
          } else {
            scope[newObjectName].id = uuid4.generate();
            scope[newObjectName].user = $rootScope.loggedUser;
            scope[newObjectName].date = new Date();
            collection.push(angular.copy(scope[newObjectName]));
            storageSvc.post(collectionName, collection);
          }

          persistencia.addPropertyTo__mockupLastSaved(newObjectName);
          persistencia.__mockupLastSaved[newObjectName] = angular.copy(scope[newObjectName]);
          Directiva.reload($state, $location);

        })
      })
    }
  }
}])

/**
Asocia objeto a otro objeto tomando como referencia los datos contenidos en el servicio que comparte informacion en la aplicacion
Esta la usamos generalmente en una ventana edit o donde sepamos que llegamos  referenciando un objeto especifico por ejemplo click a editar
una publicacion y apartir de alli asociamos a otros objetos esta publicacion
**/
Directiva.directive("mockupddAssociated", ['$state', 'storageSvc', '$location', 'persistencia', function ($state, storageSvc, $location, persistencia) {
  return {
    link: function (scope, element, attr) {
      var parts = attr.mockupddAssociated.split(" to ");
      var newObject = parts[0];
      var secondPart = parts[1].split(".");
      var asociarAobjeto = secondPart[0];
      var collectionName = secondPart[1];

      if (!scope[newObject]) {
        scope[newObject] = {};
      }
      $(element).on("click", function () {
        scope.$apply(function () {
          var collection = [];
          collection = storageSvc.getAll(collectionName);
          var objectToUpdate = (angular.copy(persistencia.__mockupLastSaved[newObject]));
          var idObjetoAasociar = persistencia.__mockupLastSaved[asociarAobjeto].id;

          for (var i = 0; i < collection.length; i++) {
            if (objectToUpdate.id == collection[i].id) {
              collection[i].foreignId = idObjetoAasociar;
              persistencia.__mockupLastSaved[newObject] = angular.copy(collection[i]);
              break;
            }
          }

          storageSvc.postAll(collectionName, collection);
          Directiva.reload($state, $location);
        })
      })
    }
  }
}])

/**
Borra objeto de una colección
**/
Directiva.directive("mockupddDelete", ['$state', 'storageSvc', '$location', function ($state, storageSvc, $location) {
  return {
    link: function (scope, element, attr) {
      var parts = attr.mockupddDelete.split(" in ");
      var object = parts[0];
      var collectionName = parts[1];
      $(element).on("click", function () {
        scope.$apply(function () {
          var collection = storageSvc.getAll(collectionName);
          var objectToDelete = (angular.copy(scope[object]));
          for (var i = 0; i < collection.length; i++) {
            if (objectToDelete.id == collection[i].id)
              var index = i;
          }
          collection.splice(index, 1);
          storageSvc.postAll(collectionName, collection);
        })
        Directiva.reload($state, $location);
      })
    }
  }
}])

/**
Borra objeto(s) asociado a otro objeto de una coleccion, tenemos la posibilidad de desasociar dicho de varias colecciones por ejemplo
mockupdd-dissociated="comments associatedWith publish"  -> coleccion: comments  ; objeto a desasociar publish cuyo id se pasara por el scope
mockupdd-dissociated="comments/likes associatedWith publish" -> coleccion: comments,likes ; objeto a desasociar publish cuyo id se pasara por el scope
mockupdd-dissociated="comments/likes/N/N/... associatedWith publish"
**/
Directiva.directive("mockupddDissociated",['$state','storageSvc', function($state,storageSvc) {
  return {
    scope: {
      prop: '@',
    },
    link: function(scope, element, attr) {
      var parts = attr.mockupddDissociated.split(" associatedWith ");
      var collectionOfAssociateds = parts[0];
      var objectAssociated = parts[1];
      $(element).on("click", function() {
        scope.$apply(function() {
          if(collectionOfAssociateds.search("/") >=0){
            collection = collectionOfAssociateds.split("/");
            for (var i=0; i < collection.length; i++){
              storageSvc.deleteAssociated(collection[i],objectAssociated,scope.prop);
            }            
          }else{
            var collectionOfAssociated = collectionOfAssociateds;
            storageSvc.deleteAssociated(collectionOfAssociated,objectAssociated,scope.prop);
          }
        })
      })
    }
  }
}])

/**
Muestra mensaje emergente con estilo. Se le envia como parámetro el mensaje a mostrar
**/
//Directiva.directive("mockupddMsg", ['SweetAlert', function (SweetAlert) {
Directiva.directive("mockupddMsg", [function () {
  return {
    link: function (scope, element, attr) {
      $(element).on("click", function () {
        //SweetAlert.swal(attr.mockupddMsg);
        alert(attr.mockupddMsg);
      })
    }
  }
}])

/**
Directiva que permite desplazarnos entre las distintas vistas independientemente si tienen parametros o no en la URL, puede utilizarse en  distintos tag html
**/
Directiva.directive("mockupddNavigate", ['$state', '$location', '$stateParams', 'persistencia', function ($state, $location, $stateParams, persistencia) {
  return {
    link: function (scope, element, attr) {
      var atributoClearDictionary = attr.mockupddClearDictionary;
      var stateName = "";
      var parts = {};
      var paramss = {};
      var paramVale = "";
      var path = "";

      $(element).on("click", function () {
        if (attr.mockupddNavigate.search("/") >= 0) {
          parts = attr.mockupddNavigate.split("/");
          stateName = parts[0];
          paramVale = parts[1];
        } else {
          stateName = attr.mockupddNavigate;
        }

        scope.$apply(function () {
          if (paramVale === "") {
            paramss = {};
            $location.path(stateName);
          } else {
            paramss[0] = paramVale;
            path = stateName + "/" + paramss[0];
            $location.path(path);
          }
        })

        if (typeof (atributoClearDictionary) !== "undefined") {
          persistencia.clean__mockupLastSaved();
        }
        //$state.go(stateName, paramss, {reload: true} );
        Directiva.reload($state, $location);
      })
    }
  }
}])
