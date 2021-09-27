/**
Servico que permite compartir informacion entre directivas
**/
app.service('persistencia', function () {

	this.__mockupLastSaved = {

		/*addMetodo : function (property) {
			Object.defineProperty(this, property, {
			value: 1,
			writable: true,
			configurable: true,
			enumerable: true
			});
		}*/
	};

	this.addPropertyTo__mockupLastSaved = function (property) {
		Object.defineProperty(this.__mockupLastSaved, property, {
			value: 1,
			writable: true,
			configurable: true,
			enumerable: true
		});
	}

	this.clean__mockupLastSaved = function (property) {
		for (var property in this.__mockupLastSaved) {
			console.log("Delete property: " + property);
			delete this.__mockupLastSaved[property];
		}
	}

	this.getValues__mockupLastSaved = function (property) {
		for (var property in this.__mockupLastSaved) {
			console.log(this.__mockupLastSaved[property]);
		}
	}
})

	// app o angular