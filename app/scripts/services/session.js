'use strict';

angular.module('fileshareApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
