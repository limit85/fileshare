'use strict';

angular.module('fileshareApp').filter('sizeConverter', function() {
  return function(size, precision) {

    if (!precision) {
      precision = 1;
    }
    if (!size) {
      return '';
    }
    else if (!isNaN(size)) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      var posttxt = 0;

      if (size < 1024) {
        return Number(size) + ' ' + sizes[posttxt];
      }
      while (size >= 1024) {
        posttxt++;
        size = size / 1024;
      }

      var power = Math.pow(10, precision);
      var poweredVal = Math.ceil(size * power);

      size = poweredVal / power;

      return size + ' ' + sizes[posttxt];
    } else {
      console.log('Error: Not a number.');
      return '';
    }
  };
});