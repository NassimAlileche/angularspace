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