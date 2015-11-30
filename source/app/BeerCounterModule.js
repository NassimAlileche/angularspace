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
