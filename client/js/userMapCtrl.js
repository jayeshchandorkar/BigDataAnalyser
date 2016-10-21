angular.module('test-app').controller('userMapCtrl', function($scope) {

    //google.setOnLoadCallback( $scope.render );

    $scope.init = function (){
      var request = gapi.client.bigquery.jobs.query({
        'projectId':gvar.projectNumber,
        'query' :  'select count(*),ip.countryLabel from (select idp.LoginName,ip.countryLabel from TestJohnsonDataSEt.IDP_FINAL idp LEFT JOIN TestJohnsonDataSEt.IP_LOCATION ip ON idp.IpAddress = ip.Ip where ip.countryLabel <> "" group by idp.LoginName,ip.countryLabel) group by ip.countryLabel;'
      });
      request.execute(function(response) {
        drawMap(response.rows);
      });
    };

    var drawMap = function(rows){

      var tabdata = [];
      var header = [];
      header.push("Country");
      header.push("Users");
      tabdata.push(header);
      angular.forEach(rows, function(value) {
        var valArr = [];
        valArr.push(value.f[1].v);
        valArr.push(parseInt(value.f[0].v));
        tabdata.push(valArr);

      });
      var options = {sizeAxis: { minValue: 0},
      displayMode: 'markers',
        colorAxis: {colors: ['#e7711c', '#4374e0', 'red','green']} // orange to blue
      };
      var chart = new google.visualization.GeoChart(document.getElementById('userDistMap'));
      chart.draw(google.visualization.arrayToDataTable(tabdata), options);

    };



  });
