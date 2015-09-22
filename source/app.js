/**
 * Setup of main AngularJS application, with Restangular being defined as a dependency.
 *
 * @see controllers
 * @see services
 */
'use strict';

var app = angular.module('vynils',
	[
		'ngRoute',
		'ngMessages',
		'ui.bootstrap'
	]
);

app.constant('API_URL': 'https://api-album');

app.constant('TYPES', {
	element: [
		{ name: 'Sell', value: 'sell' },
		{ name: 'Search', value: 'search' },
		{ name: 'Exchange', value: 'exchange' }
	]
});

app.constant('CLIENT_INFO', {
	grant_type: 'password',
	client_id: 'webapp',
	client_password: 'webapp'
});

/*
app.run(function($rootScope, API_URL) {
	$rootScope.API_URL = API_URL;
});
*/