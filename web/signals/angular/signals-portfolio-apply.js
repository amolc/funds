
app.factory('variable', function() {
  return {
    modulename: "signals",
  };
})


app.controller(
  "robot-portfolio-apply-ctrl",
  function ($scope, $http, $window, $location,$interval,$timeout, config,variable) {
    $scope.baseurl = config.baseurl;


    const urlParams = new URLSearchParams($window.location.search);
    $scope.modelportfolioId = urlParams.get('modelportfolioId') || 1;

  
    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

   
    
    $scope.init = function (req, res) {
      console.log("robotsctrl");
      console.log(config.baseurl);

      var islogin = localStorage.getItem("islogin");

      if (islogin != "1") {
        location.href = "/intro/login.html";
      } else {
        $scope.customerId = localStorage.getItem("customerId");
        if( $scope.customerId == 1){
            $("#menu").load("../menu-admin.html"); 
        }else{
            $("#menu").load("./menu.html"); 
        }       
        $("#modals").load("modals.html"); 
      
      
        $("#general").addClass("active"); 
        $("#modelcategory").addClass("active"); 
        
        $scope.name = localStorage.getItem("name");
        $scope.email = localStorage.getItem('email');
        $scope.phone = localStorage.getItem("phone");
        $scope.getCustomerdemoBalance( $scope.customerId);
        $scope.getCustomerliveBalance( $scope.customerId);
        $scope.getmodelportfolio();
        console.log("init else loop");
      }
    };

    
    $scope.getCustomerdemoBalance = function (customerId) {

      console.log(customerId)
      $scope.data = {}
      $scope.data.customerId = customerId
      console.log($scope.data )
      $scope.getbalanceurl = $scope.baseurl + "demobank/getCustomerBalance" ;
      console.log($scope.getbalanceurl);
      $http.post($scope.getbalanceurl ,$scope.data)
        .success(function (response, status) {
          $scope.balancedata = response.data
          console.log($scope.balancedata.cash_balance);
          $scope.demobalance = $scope.balancedata.cash_balance
          $scope.leveragebalance = $scope.tradebalance * 4  
          console.log($scope.tradebalance);
          console.log($scope.leveragebalance);
  
        })
        .error(function (erroresponse, status) {
          console.log(erroresponse)
          return NaN ;
        });
     
  
    };

    $scope.getCustomerliveBalance = function (customerId) {

      console.log(customerId)
      $scope.data = {}
      $scope.data.customerId = customerId
      console.log($scope.data )
      $scope.getbalanceurl = $scope.baseurl + "livebank/getCustomerBalance" ;
      console.log($scope.getbalanceurl);
      $http.post($scope.getbalanceurl ,$scope.data)
        .success(function (response, status) {
          $scope.balancedata = response.data
          console.log($scope.balancedata.cash_balance);
          $scope.livebalance = $scope.balancedata.cash_balance
          
          console.log($scope.tradebalance);
          console.log($scope.leveragebalance);
  
        })
        .error(function (erroresponse, status) {
          console.log(erroresponse)
          return NaN ;
        });
     
  
    };

    $scope.getmodelportfolio = function() {
     
  
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
          
  
          $http
            .get( $scope.baseurl + "modelportfolio/" + $scope.modelportfolioId , urlconfig)
            .success(function (response, status, headers, config) {  
              
              console.log(localStorage.getItem("tenure"));
              console.log(localStorage.getItem("cost"));

              $scope.data = response.data ;
              $scope.data.name = localStorage.getItem("name");
              $scope.data.email = localStorage.getItem('email');
              $scope.data.phone = localStorage.getItem("phone");
              $scope.data.fundingrequired = "False" ;
              $scope.data.capital = response.data.capital ;
              $scope.data.fundingamount = 0 ;
              $scope.data.fundingtenure = 0 ;
              $scope.data.balance = $scope.demobalance ;
              $scope.data.tenure = localStorage.getItem("tenure");
              $scope.data.cost = localStorage.getItem("cost");
              
              
            })
            .error(function (data, status, header, config) {
              console.log(data);
            });
    
    }

    $scope.updatefunding = function (data) {
      console.log("update funding called...");
     
     

      
      if( data.capital > data.balance ){
        console.log(data.capital);
        console.log(data.balance);
       
           console.log("update funding alert")
           $scope.msg = "You account balance is less. Please add funds."
          
           $("#portfolioconfirm").modal("show");
      }

      $scope.data.fundingamount = data.capital ;

    }

    
    $scope.submitcreateform = function (data) {
      $scope.loading = true;
        var urlconfig = {
          headers: {
            "Content-Type": "application/json;",
          },
        };
        
        console.log($scope.data) ;
        
        $scope.url = $scope.baseurl  +  variable.modulename  + "/createuserportfolio" ;

        $http
          .post( $scope.url, data, urlconfig)
          .success(function (response, status, headers, config) {
           
            $scope.loading = false;
            $scope.msg = response.msg ; 
            $scope.data = response.data ;
            console.log(response.data) ;

            $window.location.href = 'mysignals-detail.html?myportfolioId='+ response.data.id;
            $("#portfolioconfirm").modal("show");
            
  
          })
          .error(function (data, status, header, config) {
            console.log(data);
            $scope.loading = false;
            $("#getportfolio-issue").modal("show");
          });
      };

     
      $scope.apply = function (data,tenure,cost) {
        // $scope.loading = true;
        
        $scope.data = data
        $scope.data.tenure = tenure ;
        $scope.data.cost = cost ;
        console.log(data)
        setTimeout(function() {
          location.href = "/signals/signal-portfolio-apply.html?modelportfolioId=" + $scope.data.id ;
         }, 2000);
      
        
          
        };

        


   
  }

  




);
