'use strict';

describe('Directive: story', function () {

  // load the directive's module and view
  beforeEach(module('arseApp'));
  beforeEach(module('app/directives/story/story.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<story></story>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the story directive');
  }));
});
