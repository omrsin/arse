'use strict';

describe('Controller: PbiCtrl', function () {

  // load the controller's module
  beforeEach(module('arseApp'));

  var PbiCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PbiCtrl = $controller('PbiCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
