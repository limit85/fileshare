'use strict';

angular.module('fileshareApp').directive('buttonsRadio', function() {
  return {
    restrict: 'E',
    scope: {model: '=', options: '='},
    controller: function($scope) {
      $scope.activate = function(option) {
        $scope.model = option;
      };
    },
    template: '<button type="button" class="btn btn-default" ' +
            'ng-class="{active: key == model}"' +
            'ng-repeat="(key, value) in options" ' +
            'ng-click="activate(key)">{{value}} ' +
            '</button>'
  };
});