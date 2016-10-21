angular.module('test-app').controller('browserChartCtrl', function($scope) {
 //google.load('visualization', '1', {packages: ['corechart']});

  $scope.init = function() {
      render();
  }

  function render(){
        var request = gapi.client.bigquery.jobs.query({
          'projectId':gvar.projectNumber,
         // 'query' : 'select Browser, count(*) from TestJohnsonDataSEt.IDP_FINAL group by Browser;',
        'query' :   'select Browser,count(*) from (select Browser,LoginName from TestJohnsonDataSEt.IDP_FINAL group by Browser,LoginName) group by Browser'
        });
        request.execute(function(response) {
          drawChart(response.rows);
        });
        drawLineChart("IE");
  };

  function getQueryData(rows){
    var tabdata = [];
    var header = [];
    header.push("Browser");
    header.push("Usage");
    tabdata.push(header);
    angular.forEach(rows, function(value) {
     if(value.f[0].v && value.f[1].v){
        var valArr = [];
        valArr.push(value.f[0].v);
        valArr.push(parseInt(value.f[1].v));
        tabdata.push(valArr);
      }else{
        // var valArr = [];
        // valArr.push("Internal");
        // valArr.push(parseInt(value.f[1].v));
        // tabdata.push(valArr);
      }
    });

    return tabdata;
  };


function drawLineChart (selectedBrowser){

            var lineQuery = 'select month,year,count(loginName) as users, browser_version from (SELECT MONTH(IDP_FINAL.ModifiedStamp) as month,YEAR(IDP_FINAL.ModifiedStamp) as year,loginName as loginName, count(*), browser_version as browser_version from [TestJohnsonDataSEt.IDP_FINAL] as IDP_FINAL where IDP_FINAL.ModifiedStamp > TIMESTAMP("2014-06-01 00:00:00") and browser="'+ selectedBrowser +'" group by MONTH,year,loginName, browser_version) group by month,year, browser_version order by year,month;'
          var browserLineRequest = gapi.client.bigquery.jobs.query({
            'projectId':gvar.projectNumber,
            'query' : lineQuery  
          });
        browserLineRequest.execute(function(browserLineResponse) {
           var lineData = new google.visualization.DataTable();
          lineData.addColumn('string', 'Year');

          
          var dataRows = [];
          var dataJSONArr = {};
          var versions = {};
          angular.forEach(browserLineResponse.rows,function(row){
            versions[row.f[3].v] = "";
            var monthYrVersion = row.f[0].v + '/'+row.f[1].v;
            if(!dataJSONArr[monthYrVersion]) {
              dataJSONArr[monthYrVersion] = [];
            }
            var temp = {};
            dataJSONArr[monthYrVersion][row.f[3].v] = parseInt(row.f[2].v);
          });

          for (var key in versions) {
            if (versions.hasOwnProperty(key)) {
              lineData.addColumn('number', key);
            }
          }

          for (var rowKey in dataJSONArr) {
            if (dataJSONArr.hasOwnProperty(rowKey)) {
                var dataRow = [];
                dataRow.push(rowKey);
                for (var key in versions) {
                  if (versions.hasOwnProperty(key)) {
                    if(dataJSONArr[rowKey][key]){
                       dataRow.push(dataJSONArr[rowKey][key]);  
                    }else{
                       dataRow.push(0); 
                    }                     
                  }
                }
                dataRows.push(dataRow);
              }
          };

          lineData.addRows(dataRows);

          var title = selectedBrowser + " Browser Versions";
          var lineOptions = {
            title: title,
            curveType: 'function',
            legend: { position: 'right' },
            animation: {duration: 1000, easing: 'out',startup : true} 

          };

          var lineChart = new google.visualization.ChartWrapper({
            chartType: 'LineChart',
            containerId: 'browserLineChart',
            dataTable: lineData,
            options: lineOptions });
            lineChart.draw();
            google.visualization.events.addListener(lineChart, 'ready', util.loading(false));
        });

  };


  function drawChart (rows){

    var queryData = getQueryData(rows);
    var data = google.visualization.arrayToDataTable(queryData);

    var options = {
      title: 'Browser Usage',
      is3D: true,
      width: 550,
      height: 300
    };

    var chart = new google.visualization.PieChart(document.getElementById('browserChart'));

    function selectHandler() {
        util.loading(true);
        var selectedItem = chart.getSelection()[0];
        if (selectedItem) {
          var selectedBrowser = queryData[selectedItem.row + 1][0];
          drawLineChart(selectedBrowser);
        }
      }

      // Listen for the 'select' event, and call my function selectHandler() when
      // the user selects something on the chart.
      google.visualization.events.addListener(chart, 'select', selectHandler);

      chart.draw(data, options);
    }

});
