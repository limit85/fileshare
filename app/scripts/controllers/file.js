'use strict';

angular.module('fileshareApp').controller('FileCtrl', function($scope, $http, $modal, $routeParams) {
  $scope.file = {};
  $http.get('/api/files/' + $routeParams.fileId).success(function(file) {
    console.warn('file:', file);
    $scope.file = file;
  });

  $scope.edit = function() {
    $modal.open({
      templateUrl: 'partials/edit_file_dialog.html',
      controller: 'EditFileCtrl',
      resolve: {
        file: function() {
          return $scope.file;
        }
      }
    });
  };
  $scope.remove = function() {
    if (confirm('Are you sure want to delete this file?')) {
      $http.delete('/api/files/' + $scope.file._id).success(function() {

      });
    }
  };
  $scope.download = function() {
    document.location.href = '/api/files/' + $scope.file.hash + '/download';
  };
});

angular.module('fileshareApp').controller('EditFileCtrl', function($scope, $http, $modalInstance, file) {
  $scope.file = file;
  $scope.updatedFile = angular.copy(file);
  $scope.tags = [];
  $http.get('/api/files/tags').success(function(tags) {
    $scope.tags = tags;
  });

  $scope.select2Options = {
    'multiple': true,
    'simple_tags': true,
    'tags': function() {
      return $scope.tags;
    }
  };
  $scope.statuses = {
    public: 'Public',
    private: 'Private'
  };

  $scope.ok = function() {
    $http.put('/api/files', {file: $scope.updatedFile}).success(function() {
      angular.extend($scope.file, $scope.updatedFile);
      $modalInstance.close();
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };
});
