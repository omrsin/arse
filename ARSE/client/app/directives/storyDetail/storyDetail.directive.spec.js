'use strict';

describe('Directive: storyDetail', function () {

  // load the directive's module and view
  beforeEach(module('arseApp'));
  beforeEach(module('app/storyDetail/storyDetail.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<story-detail></story-detail>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the storyDetail directive');
  }));
});