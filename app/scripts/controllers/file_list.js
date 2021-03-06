'use strict';

angular.module('fileshareApp').controller('FileListCtrl', function($scope, $http, $q) {
  $scope.files = [];
  $scope.searchStr = '';

  $scope.$watch('searchStr', function(newFalue, oldValue, scope) {
    $scope.updateFileList();
  });

  var requestHandle;
  var abortRequest = function() {
    return(requestHandle && requestHandle.abort());
  };

  $scope.updateFileList = function() {
    abortRequest();
    (requestHandle = getFiles($scope.searchStr)).then(function(files) {
      $scope.files = files;
    });
  };

  function getFiles(searchStr) {
    var deferredAbort = $q.defer();
    var request = $http({
      method: 'get',
      url: '/api/files/search/' + searchStr,
      timeout: deferredAbort.promise
    });
    var promise = request.then(function(response) {
      return(response.data);
    }, function() {
      return($q.reject('Something went wrong'));
    });
    promise.abort = function() {
      deferredAbort.resolve();
    };
    promise.finally(function() {
      promise.abort = angular.noop;
      deferredAbort = request = promise = null;
    });
    return(promise);
  }


  $http.get('/api/files/tags').success(function(tags) {
    $scope.tags = tags;
  });

  $scope.download = function(file) {
    document.location.href = '/api/files/' + file.hash + '/download';
  };
});

