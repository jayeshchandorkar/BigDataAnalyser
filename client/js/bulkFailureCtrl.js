angular.module('test-app').controller('bulkFailureCtrl', function($scope) {
  //google.load('visualization', '1', {packages: ['corechart']});

  $scope.table = {show : false};
  $scope.rows = [];

    $scope.showTable = function(){
      $scope.table.show = !$scope.table.show;
    };

  $scope.duplicateRecordsInit= function () {
      var request = gapi.client.bigquery.jobs.query({
        'projectId':gvar.projectNumber,
        'query':'select Date(ModifiedStamp) as date, Hour(ModifiedStamp) as hour, LoginName as loginname,type,count(*) as count from TestJohnsonDataSEt.IDP_FINAL where type = 2 group by date,LoginName,type,hour order by count desc limit 5;'
      });
      request.execute(function(response) {
        console.log(response)
        $scope.rowsData = response.rows;
         $("#bulkFailureCount").html($scope.rowsData.length)
        angular.forEach($scope.rowsData,function(row){
        $scope.rows.push({'Date': row.f[0].v,
                           'Hour':  parseInt(row.f[1].v) ,
                           'loginName': row.f[2].v,
                            'Type' : parseInt(row.f[3].v),
                            'Count': parseInt(row.f[4].v)
                            });
        });

        //$scope.table.show = true;

});
};

});

