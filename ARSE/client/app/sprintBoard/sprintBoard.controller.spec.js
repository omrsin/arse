'use strict';

describe('Controller: SprintBoardCtrl', function () {

  // load the controller's module
  beforeEach(module('arseApp'));

  var SprintBoardCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SprintBoardCtrl = $controller('SprintBoardCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
