app.controller('stocklist-ctrl', function($scope, $http, $window,$location, config) {

    $scope.baseurl = config.baseurl ;

    $scope.logout = function (req, res) {
            localStorage.clear();
            location.href = "index.html";
          };

    $scope.init = function(req, res) {
         
         console.log(config.baseurl);
         var islogin = localStorage.getItem("islogin");

         if (islogin != "1") {
                location.href = "index.html";
              }else{
                $scope.customerId = localStorage.getItem("customerId");
                $("#menu").load("menu-admin.html"); 
               $scope.name = localStorage.getItem("name");
                 $scope.customerId = localStorage.getItem("customerId");
                 console.log($scope.customerId);

                  $scope.list();

              }

    }


    $scope.list = function(req, res) {
      $http.get(config.baseurl + 'stockdata/')
          .success(function(res) {
              if (res.status == 'false') {} else {
                  $scope.dataset = res.data;
                 
                  
                  console.log('dataset: ', $scope.dataset);
              }
          }).error(function() {});
  }



  $scope.add = function(data) {

      console.log(data);
      console.log("add")

          console.log(data);
          $http.post(config.baseurl + 'stockdata/' , data)
          .success(function(res) {
              if (res.status == 'false') {} else {
                  $scope.response = res.data;
                  console.log('message: ', $scope.response);
                  $("#addstock").modal("hide");
                  $scope.list();
              }
          }).error(function() {});

  }


  $scope.update = function(data) {
    console.log("update called");
    var id = data.id
      $http.patch(config.baseurl + 'stockdata/' + id,data)
          .success(function(res) {
              if (res.status == 'false') {} else {
                $scope.response = res.data;
                      console.log('message: ', $scope.response);
                      $("#editform").modal("hide");
                      $scope.list();
                  console.log('data: ', $scope.data);
              }
          }).error(function(errorresponse) {
            console.log(errorresponse);
          });  
  }

  $scope.delete = function(id) {
      $http.delete(config.baseurl + 'stockdata/' + id)
          .success(function(res) {
              if (res.status == 'false') {} else {
                  $scope.response = res.data;
                  console.log('data: ', $scope.response);
                  $("#deleteform").modal("hide");
                  
              }
          }).error(function() {});
          $scope.list();
          // $window.location.reload();
     
  }


    $scope.getstockstatsdata = function(){
      var data = {}
      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
        $scope.url = $scope.baseurl + "stockdata/stockdataByStats"
        console.log( $scope.url)
        $http
          .get( $scope.url , data, urlconfig)
          .success(function (response, status, headers, config) {
            $scope.dataset = response.data ;
           
          
          })
          .error(function (data, status, header, config) {
            console.log("error in getting the data");
          });

    }

        $scope.onedit = function (data) {
        console.log(data);
        $scope.stockdata = data;
        console.log($scope.stockdata);
        $("#editform").modal("show");
      };

        $scope.ondelete = function (data) {
        console.log("delete modal");
        $scope.stockdata = data ;
        $("#deleteform").modal("show");
      };

        $scope.addform = function () {
        
        $scope.data = {}
        $("#addform").modal("show");
      };





});