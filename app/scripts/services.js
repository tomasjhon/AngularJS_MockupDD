/* REST  (Nivel 2 HTTP Verbs)
 GET: Se usara para solicitar consultar a los recursos
 POST: Se usará para insertar nuevos recursos
 PUT : Se usará para actualizar recursos
 DELETE : Se usará para borrar recursos*/
var service = angular.module('services', []);
service.factory('_', function () {
	return window._;
})

service.factory('storageSvc', function () {
	return {
		getAll: function (collectionN) {
			var lsElements = [];
			if (localStorage.getItem(collectionN) != undefined) {
				lsElements = JSON.parse(localStorage[collectionN]);
			}
			return lsElements;
		},
		getData: function (collection, id) {
			var lsElements = [];
			if (localStorage.getItem(collection) != undefined) {
				lsElements = JSON.parse(localStorage[collection]);
			}
			try {
				elem = _.where(lsElements, { id: id });
				return elem;
			} catch (e) {
				console.log("Problem in service", e);
			}
		},
		getAssociated: function (id, collection1, collection2) {
			var assocElems = [];
			if ((localStorage.getItem(collection1) != undefined) && (localStorage.getItem(collection2) != undefined)) {
				collectionOne = JSON.parse(localStorage[collection1]);
				collectionTwo = JSON.parse(localStorage[collection2]);
			}
			try {
				//uso id-1 por que los arrays empiezan en 0 y los id de los resorts en 1, por lo tanto el resort con id 1 esta en la pos 0 del array
				collectionTwoElem = _.where(collectionTwo, { id: id });
				assocElems = _.where(collectionOne, { foreignId: collectionTwoElem[0].id });
				return assocElems;
			} catch (e) {
				console.log("Problem in service", e);
			}
		},
		getAssociated_: function (id, collection1) {
			var assocElems = [];
			if ((localStorage.getItem(collection1) != undefined)) {
				collectionOne = JSON.parse(localStorage[collection1]);
			}
			try {
				assocElems = _.where(collectionOne, { foreignId: id });
				return assocElems;
			} catch (e) {
				console.log("Problem in service", e);
			}
		},
		postTemp: function (collectionName, collection) {
			localStorage[collectionName] = JSON.stringify(collection);
		},
		postAll: function (collectionName, collection) {
			localStorage[collectionName] = JSON.stringify(collection);
		},
		deleteAssociated: function (collectionOne, collectionTwo, id) {
			var collectionElems = [];
			if (localStorage.getItem(collectionOne) != undefined) {
				collectionElems = JSON.parse(localStorage[collectionOne]);
			}
			try {
				//elem  = _.where(collectionElems, {foreignId: id});
				var tamanio = collectionElems.length;
				for (var i = tamanio; i > 0; i--) {
					if (id == collectionElems[i - 1].foreignId) {
						var index = i - 1;
						collectionElems.splice(index, 1);
					}
				}
				this.postAll(collectionOne, collectionElems);
			} catch (e) {
				console.log("Problem in service", e);
			}
		},
		put: function (collectionName, collection) {
			localStorage[collectionName] = JSON.stringify(collection);
		},
		post: function (collectionName, collection) {
			localStorage[collectionName] = JSON.stringify(collection);
		}
	};
});
