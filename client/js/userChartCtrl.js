angular.module('test-app').controller('userChartCtrl', function($scope) {
google.load('visualization', '1', {packages: ['corechart']});

$scope.mainChart = function (){
    drawChart($scope.rows);
};


  $scope.init = function() {
      drawChart();
  }



function drawChart(rows) {

    if(rows != undefined){

          var data = new google.visualization.DataTable();
  data.addColumn('string', 'Year');
  data.addColumn('number', 'Users');
  var dataRows = [];
  angular.forEach(rows,function(row){
   dataRows.push([row.f[0].v + '/'+row.f[1].v,parseInt(row.f[2].v)]);
  });
  data.addRows(dataRows);

        var options = {
          title: 'Users Monthwise Comparison',
          curveType: 'function',
          legend: { position: 'right' },
          animation: {duration: 1000, easing: 'out',startup : true},
          vAxis:{viewWindow: {min: 0}}

        };

var chart = new google.visualization.ChartWrapper({
    chartType: 'LineChart',
    containerId: 'usersChart',
    dataTable: data,
    options: options });


       // var chart = new google.visualization.LineChart(document.getElementById('chart_div2'));

        chart.draw();

         google.visualization.events.addListener(chart, 'select', function () {
    var sel = chart.getChart().getSelection();
    var selectedRow = rows[sel[0].row];

var request = gapi.client.bigquery.jobs.query({
          'projectId':gvar.projectNumber,
          'query':'select Day,count(loginName) as users from (SELECT DAY(IDP_FINAL.ModifiedStamp) as Day,loginName as loginName, count(*) from [TestJohnsonDataSEt.IDP_FINAL] as IDP_FINAL where MONTH(IDP_FINAL.ModifiedStamp) = ' +selectedRow.f[0].v+' and YEAR(IDP_FINAL.ModifiedStamp) = ' + selectedRow.f[1].v + ' group by Day,loginName) group by Day order by Day;'
        });

request.execute(function(response) {
          var data = new google.visualization.DataTable();
  data.addColumn('string', 'Day');
  data.addColumn('number', 'Users');
  var dataRows = [];
  angular.forEach(response.rows,function(row){
   dataRows.push([row.f[0].v ,parseInt(row.f[1].v)]);
  });
  data.addRows(dataRows);

        var options = {
          title: 'Users DrillDown Daywise Comparison',
          curveType: 'function',
          legend: { position: 'right' },
          animation: {duration: 1000, easing: 'out',startup : true},
          vAxis:{viewWindow: {min: 0}}
        };

var chart = new google.visualization.ChartWrapper({
    chartType: 'LineChart',
    containerId: 'usersChart',
    dataTable: data,
    options: options });


       // var chart = new google.visualization.LineChart(document.getElementById('chart_div2'));

        chart.draw();
});

  });


}else{
var request = gapi.client.bigquery.jobs.query({
          'projectId':gvar.projectNumber,
          'query':'select month,year,count(loginName) as users from (SELECT MONTH(IDP_FINAL.ModifiedStamp) as month,YEAR(IDP_FINAL.ModifiedStamp) as year,loginName as loginName, count(*) from [TestJohnsonDataSEt.IDP_FINAL] as IDP_FINAL where IDP_FINAL.ModifiedStamp > TIMESTAMP("2014-06-01 00:00:00") group by MONTH,year,loginName) group by month,year order by year,month;'
        });
        request.execute(function(response) {
          $scope.rows = response.rows;
          var data = new google.visualization.DataTable();
  data.addColumn('string', 'Year');
  data.addColumn('number', 'Users');
  var dataRows = [];
  angular.forEach($scope.rows,function(row){
   dataRows.push([row.f[0].v + '/'+row.f[1].v,parseInt(row.f[2].v)]);
  });
  data.addRows(dataRows);

        var options = {
          title: 'Active Users/Month',
          curveType: 'function',
          legend: { position: 'right' },
          animation: {duration: 1000, easing: 'out',startup : true},
          vAxis:{viewWindow: {min: 0}}

        };

var chart = new google.visualization.ChartWrapper({
    chartType: 'LineChart',
    containerId: 'usersChart',
    dataTable: data,
    options: options });


       // var chart = new google.visualization.LineChart(document.getElementById('chart_div2'));

        chart.draw();

         google.visualization.events.addListener(chart, 'select', function () {
    var sel = chart.getChart().getSelection();
    var selectedRow = response.rows[sel[0].row];

var request = gapi.client.bigquery.jobs.query({
          'projectId':gvar.projectNumber,
          'query':'select Day,count(loginName) as users from (SELECT DAY(IDP_FINAL.ModifiedStamp) as Day,loginName as loginName, count(*) from [TestJohnsonDataSEt.IDP_FINAL] as IDP_FINAL where MONTH(IDP_FINAL.ModifiedStamp) = ' +selectedRow.f[0].v+' and YEAR(IDP_FINAL.ModifiedStamp) = ' + selectedRow.f[1].v + ' group by Day,loginName) group by Day order by Day;'
        });

request.execute(function(response) {
          var data = new google.visualization.DataTable();
  data.addColumn('string', 'Day');
  data.addColumn('number', 'Users');
  var dataRows = [];
  angular.forEach(response.rows,function(row){
   dataRows.push([row.f[0].v ,parseInt(row.f[1].v)]);
  });
  data.addRows(dataRows);

        var options = {
          title: 'Active Users/Day',
          curveType: 'function',
          legend: { position: 'right' },
          animation: {duration: 1000, easing: 'out',startup : true},
          vAxis:{viewWindow: {min: 0}}
        };

var chart = new google.visualization.ChartWrapper({
    chartType: 'LineChart',
    containerId: 'usersChart',
    dataTable: data,
    options: options });


       // var chart = new google.visualization.LineChart(document.getElementById('chart_div2'));

        chart.draw();
});


  });

        });


   }
      }
});
