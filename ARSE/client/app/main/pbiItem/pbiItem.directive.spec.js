'use strict';

describe('Directive: pbiItem', function () {

  // load the directive's module and view
  beforeEach(module('arseApp'));
  beforeEach(module('app/directives/pbiItem/pbiItem.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<pbi-item></pbi-item>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the pbiItem directive');
  }));
});