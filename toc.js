/*
 *
 **/


(function() {
  'use strict';

  var module = angular.module('bomf.table-of-contents', []);
  module.directive('article', function() {
      return {
        restrict:   'E',
        scope:      true,
        controller: function($scope) {
          var headers = [];
          this.registerHeader = function(header) {
            headers.push(header);
            $scope.$broadcast('headerRegistered');
          };
          this.unregisterHeader = function(header) {
            var index = headers.indexOf(header);
            if(index !== -1) {
              headers.splice(index, 1);
              $scope.$broadcast('headerUnregistered');
            }
          };
          this.listHeaders = function() { return headers; };
        }
      };
    }).
    directive('bomfTableOfContents', function() {
      return {
        restrict: 'E',
        scope:    true,
        require:  '^article',
        link:     function(scope, element, attrs, article) {
          var generateTOC = function() {
            var list = angular.element('<ol class="toc-table"></ol>');
            element.empty();
            angular.forEach( article.listHeaders(),
              function(header) {
                var content = angular.element(header).text();
                var c = 'toc-header-' + header.prop('nodeName').match(/\d/)[0];
                list.append('<li class="toc-entry '+c+'">'+content+'</li>');
              }
            );
            element.append(list);
          };
          generateTOC();
          scope.$on('headerRegistered', generateTOC);
          scope.$on('headerUnregistered', generateTOC);
        }
      };
    });

    var headerLinker = function(scope, element, attrs, article) {
      article.registerHeader(element);
      var unregister = function() {article.unregisterHeader(element)};
      scope.$on('$destroy', unregister);
      element.on('$destroy', unregister);
    };

    [1,2,3,4,5,6].forEach(function(number) {
      var header = 'h' + number;
      module.directive(header, function() {
        return {
          require:  '^article',
          restrict: 'E',
          scope:    false,
          link:     headerLinker
        };
      });
    });
})();
