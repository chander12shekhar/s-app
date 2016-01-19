angular.module('FoodeeBuddee.controllers.BlogsList', [])
    .controller('BlogsListController',
                ['$scope', 'ResourcesList', 'BlogsResource',
                 function($scope, ResourcesList, BlogsResource) {
                     $scope.blogsList = new ResourcesList(BlogsResource);
                 }]);
