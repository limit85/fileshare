'use strict';

angular.module('fileshareApp').filter('idToDate', function() {
  return function(input) {
    input = input || '';
    return new Date(parseInt(input.toString().slice(0,8), 16)*1000);
  };
});