var app = angular.module('oop', ['services', 'directivas', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'uuid']);// 'oitozero.ngSweetAlert', --> // usado para el SweetAlert 

app.constant('_',
    window._
)

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('publish', {
            url: "/publish",
            templateUrl: 'views/publish.html',
        })
        .state('addComment', {
            url: "/addComment/:0",
            templateUrl: 'views/addComment.html',
        })
        .state('showComments', {
            url: "/showComments/:0",
            templateUrl: 'views/showComments.html',
        })
        .state('likes', {
            url: "/likes/:0",
            templateUrl: 'views/likes.html',
        });
    $urlRouterProvider.otherwise('/publish');
});

app.constant('configuracionGlobal', {
    'nombreApp': 'AngularMockupdd',
    'ruta': 'Ruta'
});

// Nombre de la aplicacion
app.value("appName", "AngularMockupdd");
app.value("loggedUser", "San Martin");

app.run(['$rootScope', 'appName', 'loggedUser', function ($rootScope, appName, loggedUser) {
    $rootScope.appName = appName;
    $rootScope.loggedUser = loggedUser;
    $rootScope.__app = {
        name: appName
    };
}]);

/*var users = [{ "name": "Ralph Johnson" }, { "name": "John McGuinn" }, { "name": "Alfred Montgomery" }, { "name": " JD Wilson" }];
var usersSave = JSON.stringify(users);
localStorage.setItem("users", usersSave);
*/