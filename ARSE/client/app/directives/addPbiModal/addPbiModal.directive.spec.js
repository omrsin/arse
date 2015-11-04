'use strict';

describe('Directive: addPbiModal', function () {

  // load the directive's module and view
  beforeEach(module('arseApp'));
  beforeEach(module('app/directives/addPbiModal/addPbiModal.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<add-pbi-modal></add-pbi-modal>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the addPbiModal directive');
  }));
});