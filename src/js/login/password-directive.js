angular.module('FoodeeBuddee.directives.Password', [])
  .directive('passwordValidator', function() {
    return {
      require: 'ngModel',
      link: function(scope, elem, attr, ngModel) {
        valid = false;
        ngModel.$setValidity('passwordValidator', valid);

        ngModel.$parsers.unshift(function(value) {
          valid = value === attr.passwordValidator ? true : false;
          ngModel.$setValidity('passwordValidator', valid);
          return valid ? value : undefined;
        });

        ngModel.$formatters.unshift(function(value) {
           valid = value === attr.passwordValidator ? true : false;
           ngModel.$setValidity('passwordValidator', valid);
           return valid ? value : undefined;
        });

      }

    };

  });