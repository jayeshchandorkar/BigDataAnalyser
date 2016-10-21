angular.module('test-app').controller('duplicateRecordsCtrl', function($scope) {
  //google.load('visualization', '1', {packages: ['corechart']});

  $scope.table = {show : false};
  $scope.rows = [];

  $scope.showTable = function(){
   $scope.table.show = !$scope.table.show;
    //$scope.init();
  }

  $scope.loadMore = function() {
    var totalRecords = $scope.rowsData.length;
    var last = $scope.rows.length;
    if(last != totalRecords){
      for(var i = 1; i <= 10; i++) {
        var row = $scope.rowsData[last+i];
          //$scope.rows.push({'id':last + i,'name':'Johnson'});
          $scope.rows.push({'LoginDate': row.f[0].v,
                           'LoginName':  row.f[1].v ,
                           'IpAddress': row.f[2].v,
                            'Type' : parseInt(row.f[3].v),
                            'Application':row.f[4].v,
                            'SessionUUID':row.f[5].v,
                            'Duplicates': parseInt(row.f[6].v)});
      }
    }
  };

 $scope.init= function () {
      var request = gapi.client.bigquery.jobs.query({
        'projectId':gvar.projectNumber,
        'query':'SELECT Date(LoginDate) as loginDate , LoginName , IpAddress , Type,Application,SessionUUID,duplicates from(SELECT LoginDate , LoginName , IpAddress , Type,Application,SessionUUID,count(*) duplicates FROM [TestJohnsonDataSEt.IDP_FINAL] WHERE ABS(HASH(ModifiedStamp) % 10) = 1 GROUP EACH BY LoginDate, LoginName, IpAddress, Type, Application,SessionUUID HAVING duplicates > 1 order by duplicates desc)'
      });
      request.execute(function(response) {
        console.log(response)
        $scope.rowsData = response.rows;
          $("#duplicateDataCount").html($scope.rowsData.length)
        for(i=0;i<10;i++){
          var row = $scope.rowsData[i];
          $scope.rows.push({'LoginDate': row.f[0].v,
                           'LoginName':  row.f[1].v ,
                           'IpAddress': row.f[2].v,
                            'Type' : parseInt(row.f[3].v),
                            'Application':row.f[4].v,
                            'SessionUUID':row.f[5].v,
                            'Duplicates': parseInt(row.f[6].v)
                            });
        }
        //$scope.table.show = true;

});
};

});
