angular.module('test-app').controller('baseCtrl', ['$scope', '$state', '$rootScope', function ($scope, $state, $root) {

  $scope.init = function() {

  $root.$watch('currentUser', function(newValue){
    if (newValue && newValue._id){
      $state.go( 'dashboard' );
      }else{
        $state.go( 'login' );      
      }
  });

}

  $scope.clickTab = function(tab)
  {
    $state.go( tab );
  }

  $scope.isState = function(tab) {
    return $state.is(tab);
  }

}]);