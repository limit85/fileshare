'use strict';

angular.module('fileshareApp').controller('FileListCtrl', function($scope, $http, $modal) {
  $scope.files = [];

  $http.get('/api/files/search/all').success(function(files) {
    $scope.files = files;
  });
  $http.get('/api/files/tags').success(function(tags) {
    $scope.tags = tags;
  });

  $scope.download = function(file) {
    document.location.href = '/api/files/' + file.hash + '/download';
  };
});

