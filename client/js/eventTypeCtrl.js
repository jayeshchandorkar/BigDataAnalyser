angular.module('test-app').controller('eventTypeChartCtrl', function($scope) {
  //google.load('visualization', '1', {packages: ['corechart']});


  $scope.avg ={
    Avg_Type0_Total : 0,
    Avg_Type1_Total: 0,
    Avg_Type2_Total : 0,
    Avg_Type3_Total : 0,
    Avg_Type6_Total : 0,
    Avg_Type7_Total : 0,
  };
  $scope.init = function() {
    drawChart();
  }

    function drawChart(rows) {
      var request = gapi.client.bigquery.jobs.query({
        'projectId':gvar.projectNumber,
        'query':'select Type,month,year,count(loginName) as users from (SELECT IDP_FINAL.Type as Type,MONTH(IDP_FINAL.ModifiedStamp) as month,YEAR(IDP_FINAL.ModifiedStamp) as year,loginName as loginName, count(*) from [TestJohnsonDataSEt.IDP_FINAL] as IDP_FINAL where IDP_FINAL.ModifiedStamp > TIMESTAMP("2014-06-01 00:00:00")  and Type IN (0,1,2,3,6,7) group by Type, MONTH,year,loginName) group by month,year,Type order by year,month,Type;'
      });
      request.execute(function(response) {
        console.log(response)
        $scope.rows = response.rows;
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Year');
        data.addColumn('number', 'Login');
        data.addColumn('number', 'Logout');
        data.addColumn('number', 'Expiration');
        data.addColumn('number', 'Failed login');
        data.addColumn('number', 'failed OneTimePassword');
        data.addColumn('number', 'Forced Logout');


        var dataRows = [];
        var Type0;
        var Type1;
        var Type2;
        var Type3;
        var Type6;
        var Type7;

        var Type0_Total = 0;
        var Type1_Total = 0;
        var Type2_Total = 0;
        var Type3_Total = 0;
        var Type6_Total = 0;
        var Type7_Total = 0;


        angular.forEach($scope.rows,function(row){
         switch(parseInt(row.f[0].v)){
          case 0 :
          Type0 = parseInt(row.f[3].v);
          Type0_Total = Type0_Total + Type0;
          break;
          case 1 :
          Type1 = parseInt(row.f[3].v);
          Type1_Total = Type1_Total + Type1;
          break;
          case 2 :
          Type2 = parseInt(row.f[3].v);
          Type2_Total = Type2_Total + Type2;
          break;
          case 3 :
          Type3 = parseInt(row.f[3].v);
          Type3_Total = Type3_Total + Type3;
          break;
          case 6 :
          Type6 = parseInt(row.f[3].v);
          Type6_Total = Type6_Total + Type6;
          break;
          case 7 :
          Type7 = parseInt(row.f[3].v);
          Type7_Total = Type7_Total + Type7;
          dataRows.push([row.f[1].v + '/'+row.f[2].v,Type0,Type1,Type2,Type3,Type6,Type7]);
          break;
        }



        $scope.avg.Avg_Type0_Total = Type0_Total/14;
        $scope.avg.Avg_Type1_Total = Type1_Total/14;
        $scope.avg.Avg_Type2_Total = Type2_Total/14;
        $scope.avg.Avg_Type3_Total = Type3_Total/14;
        $scope.avg.Avg_Type4_Total = 0
         $scope.avg.Avg_Type5_Total = 0
        $scope.avg.Avg_Type6_Total = Type6_Total/14;
        $scope.avg.Avg_Type7_Total = Type7_Total/14;
        document.getElementById("login").innerHTML =  Math.round($scope.avg.Avg_Type0_Total);
        document.getElementById("logout").innerHTML = Math.round( $scope.avg.Avg_Type1_Total);
        document.getElementById("expiration").innerHTML =  Math.round($scope.avg.Avg_Type2_Total);
        document.getElementById("failedLogin").innerHTML =  Math.round($scope.avg.Avg_Type3_Total);
        document.getElementById("failedChallenge").innerHTML =  Math.round($scope.avg.Avg_Type4_Total);
        document.getElementById("redHerring").innerHTML =  Math.round($scope.avg.Avg_Type5_Total);
        document.getElementById("failedOneTime").innerHTML =  Math.round($scope.avg.Avg_Type6_Total);
        document.getElementById("forcedLogout").innerHTML =  Math.round($scope.avg.Avg_Type7_Total);
      });


data.addRows(dataRows);
var options = {
  title: 'Events/Month',
  curveType: 'function',
  legend: { position: 'right' },
  animation: {duration: 1000, easing: 'out',startup : true},
  width: 900,
  height: 400,
  vAxis:{viewWindow: {min: 0}}
};
var chart = new google.visualization.ChartWrapper({
  chartType: 'LineChart',
  containerId: 'eventChart',
  dataTable: data,
  options: options });

       // var chart = new google.visualization.LineChart(document.getElementById('chart_div2'));
       chart.draw();

       var userPerMonth = $("#userPerMonth");
        if(userPerMonth){
          userPerMonth.show();
        }
     });
}


});
