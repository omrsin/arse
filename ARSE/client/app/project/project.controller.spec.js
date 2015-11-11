'use strict';

describe('Controller: ProjectCtrl', function () {
  var $httpBackend, $rootScope, createController, authRequestHandler;

  // load the controller's module
  beforeEach(module('arseApp'));

  var ProjectCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');
    // The $controller service is used to create instances of controllers
    var $controller = $injector.get('$controller');

    createController = function() {
      return $controller('ProjectCtrl', {'$scope' : $rootScope });
    };
  }));

  afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });

  it('should succedd in creating project', function() {

    // data
    $rootScope.name = "P";
    $rootScope.description = "p";

    $httpBackend.expectPOST('/api/projects').respond(201, {name: "P", description: "p"});
    var controller = createController();
    $rootScope.insertProject();
    $httpBackend.flush();


    expect($rootScope.isCreated).toBe(true);
    expect($rootScope.creationFailed).toBeFalsy();
   });

  it('should fail in creating project', function() {

    // data
    $rootScope.name = "P";
    $rootScope.description = "p";
    // internal server error
    var errmsg = "This shit just exploded";
    $httpBackend.expectPOST('/api/projects').respond(500, errmsg);
    var controller = createController();
    $rootScope.insertProject();
    $httpBackend.flush();


    expect($rootScope.isCreated).toBe(false);
    expect($rootScope.creationFailed).toEqual(errmsg);
   });

});
