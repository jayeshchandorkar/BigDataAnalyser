angular.module("test-app").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function ($urlRouterProvider, $stateProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'client/views/home.ng.html',
        controller: 'homeCtrl'
      }).state('dashboard', {
        url: '/dashboard',
        templateUrl: 'client/views/dashboard.ng.html',
        controller: 'dashboardCtrl'
      }).state('loginsimulator', {
        url: '/loginsimulator',
        templateUrl: 'client/views/loginSimulator.ng.html',
        controller: 'loginSimulatorCtrl'
      }).state('login', {
        url: '/login',
        templateUrl: 'client/views/login.ng.html',
        controller: 'LoginCtrl',
        controllerAs: 'lc'
      }).state('register',{
        url: '/register',
        templateUrl: 'client/views/register.ng.html',
        controller: 'RegisterCtrl',
        controllerAs: 'rc'
      })
      .state('resetpw', {
        url: '/resetpw',
        templateUrl: 'client/views/reset-password.ng.html',
        controller: 'ResetCtrl',
        controllerAs: 'rpc'
      })
      .state('logout', {
        url: '/logout',
        resolve: {
          "logout": ['$meteor', '$state', function($meteor, $state) {
            return $meteor.logout().then(function(){
              $state.go('login');
            }, function(err){
              console.log('logout error - ', err);
            });
          }]
        }
      })

    $urlRouterProvider.otherwise("/login");
  }]);
