'use strict';

describe('Controller: BacklogCtrl', function () {

  // load the controller's module
  beforeEach(module('arseApp'));

  var BacklogCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BacklogCtrl = $controller('BacklogCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
