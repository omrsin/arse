'use strict';

describe('Directive: chatWidget', function () {

  // load the directive's module and view
  beforeEach(module('arseApp'));
  beforeEach(module('app/directives/chatWidget/chatWidget.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chat-widget></chat-widget>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the chatWidget directive');
  }));
});
