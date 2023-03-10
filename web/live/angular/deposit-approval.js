/*  */
app.factory('variable', function() {
  return {
    modulename: "roboportfoliolive",
    bankmodule: "livebank",

  };
})
app.controller(
    "deposit-approval-ctrl",
    function ($scope, $http, $window, $location, $document, config,variable) {


        $scope.baseurl = config.baseurl;
        $scope.socketurl = config.socketurl;
        $scope.totalprofitloss = 0
        console.log($scope.baseurl)

        let lastprice = 'null';
        console.log(lastprice);

        $scope.dataset = null;
        $scope.depositdetail = {} ;

        $scope.statusdata = {
            model: null,
            options: [
              {id: 'Pending', name: 'Pending'},
              {id: 'Confirm', name: 'Confirm'},
              {id: 'Rejected', name: 'Rejected'}
            ]
           };

        $scope.init = function (req, res) {
            var islogin = localStorage.getItem("islogin");
        
            if (islogin != "1") {
              location.href = "index.html";
            }
            else {

                if( $scope.customerId == 1){
                    $("#menu").load("menu-admin.html"); 
                }else{
                    // $("#menu").load("menu.html"); 
                    $("#menu").load("./menu.html"); 
                }
                $("#general").addClass("active"); 
                $("#modelcategory").addClass("active");
              $scope.id = localStorage.getItem("id");
              $scope.name = localStorage.getItem("name");
              $scope.email = localStorage.getItem("email");
              $scope.apparea = localStorage.getItem("apparea");
              $scope.customerId = localStorage.getItem("customerId");
              $scope.getDepositbycustomers($scope.customerId);
              $scope.getCustomerBalance($scope.customerId);
              $scope.getCustomerfinanceinfo($scope.customerId);

             
              
            }
          };


          $scope.getCustomerBalance = function (customerId) {
            console.log(customerId)
            $scope.data = {}
            $scope.data.customerId = customerId
            console.log($scope.data )
            $scope.getbalanceurl = $scope.baseurl + variable.bankmodule +"/getCustomerBalance" ;
            console.log($scope.getbalanceurl);
            $http.post($scope.getbalanceurl ,$scope.data)
              .success(function (response, status) {
                $scope.balancedata = response.data
                console.log($scope.balancedata.cash_balance);
                $scope.bankbalance = $scope.balancedata.cash_balance
               
                console.log($scope.tradebalance);
                console.log($scope.leveragebalance);
        
              })
              .error(function (erroresponse, status) {
                console.log(erroresponse)
                return NaN ;
              });
           
        
          };
    
        $scope.getCustomerfinanceinfo = function (customerId) {
    
            console.log(customerId)
            $scope.data = {}
            $scope.data.customerId = customerId
            console.log($scope.data )
            $scope.getbalanceurl = $scope.baseurl + variable.bankmodule + "/getCustomerfinanceinfo" ;
            console.log($scope.getbalanceurl);
            $http.post($scope.getbalanceurl ,$scope.data)
              .success(function (response, status) {
                $scope.financeinfo = response
                console.log($scope.financeinfo)
              })
              .error(function (erroresponse, status) {
                console.log(erroresponse)
                return NaN ;
              });
          
          };

         

        $scope.getDepositbycustomers = function (agentId) {
            console.log("calling deposit", $scope.baseurl);
            $scope.data = {};
            $scope.data.agentId = agentId ;
           
            $http.post($scope.baseurl + variable.bankmodule + "/getDepositbyAgentId", $scope.data)
                .success(function (response, status) {
                    $scope.deposit_list = response.data;
                    console.log("result", $scope.deposit_list)
                })
                .error(function (response, status, header, config) {
                    $scope.ResponseDetails = response;
                    console.log(response);
                });
        };

       
        $scope.getDepositbydepositId = function (depositId) {
            console.log("calling deposit", $scope.baseurl);
            $scope.url = $scope.baseurl  + variable.bankmodule + "/deposit/" + depositId ;
            console.log($scope.url)
            $http.get( $scope.url)
                .success(function (response, status) {
                    $scope.depositdetail = response.data;
                    console.log("depositdetail", $scope.depositdetail)
                })
                .error(function (response, status, header, config) {
                    $scope.ResponseDetails = response;
                    console.log(response);
                });
        };


        $scope.addDeposits = function (depositform) {
            console.log("Addd Deposits Calling ......", depositform);
            $scope.data = {};
            $scope.data.agent_name = depositform.agent_name ;
            $scope.data.amount = depositform.cash_sgd ;
            $scope.data.org_id = depositform.org_id ;
            $scope.data.status = "Pending" ;
            $scope.data.balance = 0 ;
            $scope.data.currency = "USD" ;
            $scope.data.customer_id = depositform.customerId ;
            console.log($scope.data);

            $http.post($scope.baseurl  + variable.bankmodule + "/deposit/", $scope.data, $scope.config)
                .success(function (response, status) {
                    console.log(response);
                    $scope.getDeposits()
                })
                .error(function (response, status) {
                    $scope.error = response;
                });
        };

        $scope.confirmdeposit = function (depositdetail) {
            console.log("Addd Deposits Calling ......", depositdetail);
            
            $http.post($scope.baseurl + variable.bankmodule + "/confirmdeposit", depositdetail)
                .success(function (response, status) {
                    console.log(response);
                    $scope.getDepositbycustomers($scope.customerId);

                })
                .error(function (response, status) {
                    $scope.error = response;
                });
        };
    });


    

 // version 2.14
