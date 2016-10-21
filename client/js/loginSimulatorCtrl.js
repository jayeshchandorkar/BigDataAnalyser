angular.module('test-app').controller('loginSimulatorCtrl', ['$scope', '$state', function ($scope, $state) {

   google.load('visualization', '1', {packages: ['corechart']});
  $scope.user = {
   os : '',
   browser : '',
   location : ''
 }


 $scope.prediction = {
  os : '',
  browser : '',
  location : ''
}
$scope.lastLogin = {

}

util.loading(false);

$scope.onUserEnter = function(){
  console.log("User Data Entered")
  console.log($scope.user);


  var last_login_request = gapi.client.bigquery.jobs.query({
    'projectId':gvar.projectNumber,
    'query':'select Browser,OS ,ip.city location from TestJohnsonDataSEt.IDP_FINAL as idp LEFT JOIN TestJohnsonDataSEt.IP_LOCATION as ip ON idp.ipAddress = ip.ip where idp.loginName = "'+ $scope.user.loginName+'" limit 1;'
  });

  last_login_request.execute(function(response) {
    console.log("Response")

    if(parseInt(response.result.totalRows) == 1) {
     console.log("Records availble ")
     $scope.lastLogin = {
      os: response.rows[0].f[1].v,
      browser : response.rows[0].f[0].v,
      location : response.rows[0].f[2].v
    }
    callPredictions();
  }else {
    console.log("No Records available")
  }

});


  $scope.simulateLogin = function(){
    console.log("Analysing threat !!");
    $scope.threat = {
      location : 0,
      os : 0,
      browser : 0
    }

    if($scope.user.os != $scope.prediction.os) { $scope.threat.os = $scope.threat.os+ 1};
    if($scope.user.os == $scope.prediction.os) { if( $scope.prediction.os > 0) $scope.threat.os = $scope.threat.os - 0.8};

    if($scope.user.location != $scope.prediction.location) { $scope.threat.location = $scope.threat.location+ 1};
    if($scope.user.location == $scope.prediction.location) { if( $scope.prediction.location > 0) $scope.threat.location = $scope.threat.location - 0.8};


    if($scope.user.browser != $scope.prediction.browser) { $scope.threat.browser = $scope.threat.browser+ 1};
    if($scope.user.browser == $scope.prediction.browser) { if( $scope.prediction.browser > 0) $scope.threat.browser = $scope.threat.browser - 0.8};

     showThreatData();
  }


  $scope.clear = function(){
    $scope.user = {
    };
  }


  function callPredictions() {
    util.loading(true);
    var os_req = gapi.client.prediction.trainedmodels.predict({
      'project':gvar.projectNumber,
      "id" : "predict_os",
      "input":
      {
        "csvInstance":
        [
        $scope.user.loginName
        ]
      }
    });
    os_req.execute(function(response) {
      $scope.prediction.os = response.outputLabel;
      $scope.$apply();
    });

    var browser_req = gapi.client.prediction.trainedmodels.predict({
      'project':gvar.projectNumber,
      "id" : "predict_browser",
      "input":
      {
        "csvInstance":
        [
        $scope.user.loginName
        ]
      }
    });
    browser_req.execute(function(response) {
      $scope.prediction.browser = response.outputLabel;
      $scope.$apply();
    });

    var country_req = gapi.client.prediction.trainedmodels.predict({
      'project':gvar.projectNumber,
      "id" : "predict_city",
      "input":
      {
        "csvInstance":
        [
        $scope.user.loginName
        ]
      }
    });
    country_req.execute(function(response) {
      $scope.prediction.location = response.outputLabel;
      $scope.$apply();
      util.loading(false);
    });
  }
}


 function showThreatData() {

    var total = 2*$scope.threat.os + 3 *$scope.threat.location + 1 *$scope.threat.browser;
    total = total * 100/6;

    $scope.threat.os = $scope.threat.os *100;
     $scope.threat.location = $scope.threat.location *100;
      $scope.threat.browser = $scope.threat.browser *100;
      $scope.threat.total = Math.round(total);
      $scope.threatClass = "safe";
    if(total < 1)
      $scope.threatClass = "safe";
    else if (total > 1 && total < 51) {
      $scope.threatClass = "warn";
    }
     else if (total > 49 ) {
      $scope.threatClass = "danger";
    }

}



  $scope.drawDetails = function() {
      util.loading(true);
      renderOSChart();
      renderLocationChart();
      renderBrowserChart();
  }

 function renderOSChart(){
        var request = gapi.client.bigquery.jobs.query({
          'projectId':gvar.projectNumber,
          'query':'Select IDP_FINAL.OS as OS, count(OS) as Count from [TestJohnsonDataSEt.IDP_FINAL] as IDP_FINAL where LoginName="'+ $scope.user.loginName+'" and OS <> " " group by OS;'
        });
        request.execute(function(response) {
          drawOSChart(response.rows);
        });
  };
function getQueryData(rows,label){
    var tabdata = [];
    var header = [];
    header.push(label);
    header.push("Count");
    tabdata.push(header);
    angular.forEach(rows, function(value) {
      console.log(value);
     if(value.f[0].v && value.f[1].v){
        var valArr = [];
        valArr.push(value.f[0].v);
        valArr.push(parseInt(value.f[1].v));
        tabdata.push(valArr);
      }
    });
    console.log(tabdata);
    return tabdata;
  };
  function drawOSChart (rows){
    var queryData = getQueryData(rows,"Operating System");
    var data = google.visualization.arrayToDataTable(queryData);
    var options = {
      title: 'Operating System',
      is3D: true,
      width: 500,
      height: 500
    };
    var chart = new google.visualization.PieChart(document.getElementById('osPieChart'));
    chart.draw(data, options);
    }

  function renderLocationChart(){
        var loca_requ = gapi.client.bigquery.jobs.query({
          'projectId':gvar.projectNumber,
          'query':'Select IP_LOCATION.CITY as CITY, count(CITY) as Count from [TestJohnsonDataSEt.IP_LOCATION] as IP_LOCATION JOIN EACH TestJohnsonDataSEt.IDP_FINAL as IDP_FINAL ON IP_LOCATION.ip = IDP_FINAL.ipAddress where IDP_FINAL.LoginName="'+$scope.user.loginName+'" and CITY <> " " group by CITY'
        });
        loca_requ.execute(function(response) {
          drawLocationChart(response.rows);
        });
  };

 function stopLoading(){
  util.loading(false);
 }

  function drawLocationChart (rows){
    var queryData = getQueryData(rows,"Location");
    var data = google.visualization.arrayToDataTable(queryData);
    var options = {
      title: 'Location',
      is3D: true,
      width: 500,
      height: 500
    };
    var chart = new google.visualization.PieChart(document.getElementById('locationPieChart'));
    google.visualization.events.addListener(chart, 'ready', stopLoading);
    chart.draw(data, options);
    }

  function renderBrowserChart(){
        var loca_requ = gapi.client.bigquery.jobs.query({
          'projectId':gvar.projectNumber,
          'query':'Select IDP_FINAL.Browser as Browser, count(Browser) as Count from [TestJohnsonDataSEt.IDP_FINAL] as IDP_FINAL where LoginName="'+$scope.user.loginName+'" and Browser <> " "  group by Browser;'
        });
        loca_requ.execute(function(response) {
          drawBrowserChart(response.rows);
        });
  };

  function drawBrowserChart (rows){
    var queryData = getQueryData(rows,"Browser");
    var data = google.visualization.arrayToDataTable(queryData);
    var options = {
      title: 'Browser',
      is3D: true,
      width: 500,
      height: 500
    };
    var chart = new google.visualization.PieChart(document.getElementById('browserPieChart'));

    chart.draw(data, options);
    }




}]);
