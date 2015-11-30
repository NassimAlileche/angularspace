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