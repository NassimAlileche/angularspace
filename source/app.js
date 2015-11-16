/**
 * Setup of main AngularJS application, with Restangular being defined as a dependency.
 *
 * @see controllers
 * @see services
 */
'use strict';

var app = angular.module('ExampleApp', [   
	'restangular',
	'ExampleApp.controllers',
	'ExampleApp.services'
]);