'use strict';

/**
 *
 *
 */
var mainAppModule = angular.module('MainAppModule', ['ngRoute', 'ngMessages', 'ui.bootstrap', 'BeerCounterModule']);

/** ===============================================================================================
 * Application config
 *
 * ============================================================================================= */

mainAppModule.constant('API_REST_URL', 'https://myapi.domain.org/');
mainAppModule.constant('API_GITHUB_URL', 'https://api.github.com/users/NassimAlileche/repos');
mainAppModule.constant('API_URL', 'http://www.w3schools.com/angular/customers.php');
mainAppModule.constant('TEMPLATES_ROOT', 'source/app/views/templates/');

mainAppModule.run(function ($rootScope, API_URL) {
	$rootScope.API_URL = API_URL;
});

// Router configuration
mainAppModule.config(function ($routeProvider, TEMPLATES_ROOT) {
	var root = TEMPLATES_ROOT;
	$routeProvider
		.when('/', {
			templateUrl : root + 'index.html'
		})
		.when('/active', {
			templateUrl : root + 'active.html',
			controller  : 'ActiveController'
		})
		.when('/gallery', {
			templateUrl : root + 'gallery.html',
			controller  : 'GalleryController'
		})
		.when('/todolist', {
			templateUrl : root + 'todolist.html',
			controller  : 'TodoListController'
		})
		.when('/beer', {
			templateUrl : root + 'beercounter.html',
			controller  : 'BeerCounterController'
		})
		.otherwise({
			redirectTo : '/'
		});
});
