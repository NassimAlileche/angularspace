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
