if (Meteor.isClient) {
  angular.module('test-app',[
   'angular-meteor',
   'ui.router',
   'ngMaterial',
   'ngAnimate',
   'ngAria',
   'infinite-scroll',
   'ngMessages']);

  angular.module('test-app').config(['$mdIconProvider', function ($mdIconProvider) {
    $mdIconProvider
    .iconSet("social", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg")
    .iconSet("action", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg")
    .iconSet("communication", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg")
    .iconSet("content", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg")
    .iconSet("toggle", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-toggle.svg")
    .iconSet("navigation", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg")
    .iconSet("image", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-image.svg");
  }]);

  function onReady() {
    angular.bootstrap(document, ['test-app']);
    google.load('visualization', '1.1', {packages: ['corechart']});
  }

  if (Meteor.isCordova)
    angular.element(document).on("deviceready", onReady);
  else
    angular.element(document).ready(onReady);

  // User Submitted Variables#
  window.gvar = {};
  window.gvar.projectNumber = '243626976689';
  var clientId = '243626976689-h40o069hfl06l9pif3nac3iq8tgsfg3t.apps.googleusercontent.com';


  function authenticate (){
   var config = {
    'client_id': clientId,
    'scope': 'https://www.googleapis.com/auth/bigquery https://www.googleapis.com/auth/prediction'
  };
  if( !gapi.client.bigquery) {
    gapi.auth.authorize(config, function() {
     gapi.client.load('bigquery', 'v2');
     gapi.client.load('prediction', 'v1.6');
     getData();
   });
  }
}
function checkAuth() {
 setTimeout(function(){
   gapi.auth == undefined ? checkAuth() : authenticate();
 }, 100);
}
checkAuth();

function getData(){

 setTimeout(function(){
   gapi.client.bigquery == undefined ? getData() : listDatasets();
 }, 100);
}

window.util = {};
window.util.loading = function (show){
  var loader = $("#loading");
  if(loader){
    if(show){
      loader.show();
    }else{
      loader.hide();
    }
  }
}

function listDatasets() {

  console.log("Listing data sets")
  var request = gapi.client.bigquery.datasets.list({
    'projectId':gvar.projectNumber
  });
  request.execute(function(response) {
    console.log(JSON.stringify(response.result.datasets, null))
  });
}

}
