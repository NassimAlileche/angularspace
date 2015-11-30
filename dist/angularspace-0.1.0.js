'use strict';

/**
 *
 *
 */
mainAppModule.controller('ActiveController', ['$scope', '$http', 'ActiveService', function ($scope, $http, ActiveService) {
		ActiveService.someAsyncMethod()
			.success(function(response) { $scope.customernames = response.records; })
			.error(function(response) { console.log("error ActiveService.someAsyncMethod"); });
	}])

	.directive('ActiveDirective', function () {


	})

	.service('ActiveService', function($http, API_URL) {

		function someAsyncMethod() {
			return $http({ method: 'GET', url: API_URL, cache: true });
			//return $http.get(API_URL);
		};

		return {
			someAsyncMethod: someAsyncMethod
		};
	});
'use strict';

/**
 *
 *
 */
var beerCounterModule = angular.module('BeerCounterModule', ['componentsModule']);

beerCounterModule.controller('BeerCounterController', function ($scope, $locale) {
	$scope.beers = [ 0, 1, 2, 3, 4, 5, 6, 7 ];
	if ($locale.id == 'en-us') {
		$scope.beerForms = {
			'0': 'no beers',
			one: '{} beer',
			other: '{} beers'
		};
	}
	else {
		$scope.beerForms = {
			'0': 'žiadne pivo',
			one: '{} pivo',
			few: '{} pivá',
			other: '{} pív'
		};
	}
});

var componentsModule = angular.module('componentsModule', [])

	.directive('tabs', function () {
		return {
			restrict: 'g',
			transclude: true,
			scope: {},
			controller: function ($scope, $element) {
				var panes = $scope.panes = [];
				 
				$scope.select = function(pane) {
					angular.forEach(panes, function(pane) {
						pane.selected = false;
					});
					pane.selected = true;
				};

				this.addPane = function(pane) {
					if (panes.length == 0) 
						$scope.select(pane);
					panes.push(pane);
				};
			},
			template: '<div class="tabbable">' + '<ul class="nav nav-tabs">' + '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+ '<a href="" ng-click="select(pane)">{{pane.title}}</a>' + '</li>' + '</ul>' + '<div class="tab-content" ng-transclude></div>' + '</div>',
        	replace: true
		};
	})

	.directive('pane', function () {
		return {
			require: '^tabs',
			restrict: 'E',
			transclude: true,
			scope: { title: '@' },
			link: function (scope, element, attrs, tabsController) {
				tabsController.addPane(scope);
			},
			template: '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' + '</div>',
			replace: true
		};
	});

'use strict';

/**
 *
 *
 */
mainAppModule.controller("GalleryController", ['$scope', function ($scope) {

		var imagePath = "source/static/images/";
		$scope.galleryTitle = "My Gallery";
		
		$scope.galleryImages = [
			{main:imagePath + "image01.png",thumb:imagePath + "image01.png",title:"Image 1",description:"Image 1 description"},
			{main:imagePath + "image02.png",thumb:imagePath + "image02.png",title:"Image 2",description:"Image 2 description"},
			{main:imagePath + "image03.png",thumb:imagePath + "image03.png",title:"Image 3",description:"Image 3 description"},
			{main:imagePath + "image04.png",thumb:imagePath + "image04.png",title:"Image 4",description:"Image 4 description"},
		];
	}])

	.directive("dirGallery", function () {

		return {
			restrict: 'A',
			scope: {
				title:  "=galleryTitle",
				images: "=galleryImages"
			},
			controller: function($scope, $element, $attrs) {
				$scope.mainImage = $scope.images[0];
				$scope.showMainImage = false;
				$scope.selectImage = function(image) {
					$scope.showMainImage = true;
					$scope.mainImage = image;
				};
				$scope.close = function(e) {
					if(e) { e.preventDefault(); }
					$scope.showMainImage = false;
				}
			},
			templateUrl: "source/app/views/directives/dirGallery.html"
		};
	});
'use strict';

/**
 *
 *
 */
mainAppModule.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.interceptors.push('HttpInterceptor');
	}])

	.factory('HttpInterceptor', [ '$log', '$q', '$injector', '$rootScope', function ($log, $q, $injector, $rootScope) {

		
		$log.debug('HTTP Interceptor');
		
		var httpInterceptor = {

			request: function (config) {
				console.log("request", config);
				var LocalStorageService = $injector.get('LocalStorageService');
				if(LocalStorageService.isKey('access')) {
					config.headers.Authorization = 'Bearer ' + LocalStorageService.get('access');

					if(angular.isDefined(config.cache) && typeof config.cache === true) {
						config.cache = false;
					}
				}
				$rootScope.$broadcast('httpRequest', config);
				return config;// || $q.when(config);
			},
			requestError : function (rejection) {
				$rootScope.$broadcast('httpRequestError', rejection);
				return $q.reject(rejection);
			},
			response : function (response) {
				$rootScope.$broadcast('httpResponse', response);
				return response;
			},
			responseError : function (rejection) {
				switch(rejection.status) {
					//rejection.status is the error number
					case 401 :
						//var UserService = $injector.get('UserService');
						//UserService.tokenRefresh();
						break;
					default :
						break;
				}
				$rootScope.$broadcast('httpResponseError', rejection);
				return $q.reject(rejection);
			}

		};

		return httpInterceptor;
	}]);

'use strict';

/**
 * LocalStorageService service
 *
 * Use DOM Local storage for storing data
 */
mainAppModule.service('LocalStorageService', function($window, $rootScope) {

	/**
	 * Save data in local storage : use of window.localStorage.setItem(key, value)
	 *
	 * @param 	Object JSON    data {"key" : "value" [, "key" : "value" ]}
	 *
	 * @return 	Boolean        true if successful, otherwise false
	 */
	function save(data) {
		//console.log('data : ', data);
		if(typeof data === 'object') {
			for(var key in data) {
				if(data.hasOwnProperty(key)) {
					var value = data[key];
					if(typeof value === 'object') {
						value = JSON.stringify(value);
					}
					$window.localStorage.setItem(key, value);
				}
			}
			// event
			$rootScope.$broadcast('LocalStorageUpdatedEvent');
			return true;
		}
		return false;
	}

	/**
	 * Get value in local storage
	 *
	 * @param 	String                                 key
	 *
	 * @return 	String|Int|Boolean|Object|undefined    value associated with key
	 */
	function get(key) {
		var output = null;
		if(isKey(key)) {
			try {
				output = JSON.parse($window.localStorage[key]);
			} catch(err) {
				alert(err);
			}
		}
		return output;
	}

	/**
	 * Check if key exists : use of window.localStorage.getItem(key)
	 *
	 * @param 	String     key
	 *
	 * @return 	Boolean    true if successful, otherwise false
	 */
	function isKey(key) {
		try {
			if($window.localStorage.getItem(key)) { return true; }
		} catch(err) {
			return false;
		}
		return false;
	}

	/**
	 * Remove item in local storage : use of removeKey(key)
	 *
	 * @param 	String     key
	 *
	 * @return 	Boolean    true if successful, otherwise false
	 */
	function remove(key) {
		try {
			$window.localStorage.removeKey(key);
			// event
			$rootScope.$broadcast('LocalStorageUpdatedEvent');
			return true; 
		} catch(err) {
			return false;
		}
		return false;
	}

	/**
	 * Remove all items in local storage : use of window.localStorage.clear()
	 *
	 * @return 	Boolean    true if successful, otherwise false
	 */
	function flush() {
		try {
			$window.localStorage.clear();
			// event
			$rootScope.$broadcast('LocalStorageUpdatedEvent');
			return true;
		} catch(err) {
			return false;
		}
		return false;
	}

	/**
	 * Gets LocalStorage Array length : use of window.localStorage.length()
	 *
	 * @return 	Int    length
	 */
	 function getLength() {
	 	return $window.localStorage.length();
	 }

	return ({
		get    : get,
		save   : save,
		isKey  : isKey,
		delete : remove,
		flush  : flush,
		length : getLength
	});
});
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

'use strict';

/**
 *
 *
 */
mainAppModule.controller("TodoListController", ['$scope', function ($scope) {
		//console.log("TodoListController");
		var todoList = this;
		todoList.todos = [
			{text:'Learn angular',done:true},
			{text:'Build an angular app',done:false}
		];

		todoList.addTodo = function() {
			todoList.todos.push({text:todoList.todoText,done:false});
			todoList.todoText = '';
		};

		todoList.remaining = function() {
			var count = 0;
			angular.forEach(todoList.todos, function(todo) {
				count += todo.done ? 0 : 1;
			});
			return count;
		};

		todoList.archive = function() {
			var oldTodos = todoList.todos;
			todoList.todos = [];
			angular.forEach(oldTodos, function(todo) {
				if (!todo.done) todoList.todos.push(todo);
			});
		};
	}]);