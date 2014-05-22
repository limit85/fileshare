'use strict';

angular.module('fileshareApp')
        .factory('Files', function($resource) {
          return {
            search: $resource('/api/files/:searchStr', {searchStr: 'searchStr'}, {
              get: {
                method: 'GET',
                params: {},
                isArray: true
              }
            })
          };
        });
