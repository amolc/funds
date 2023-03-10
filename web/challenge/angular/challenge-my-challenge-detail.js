
app.factory('variable', function() {
  return {
    modulename: "challenge",
  };
})

app.controller(
  "challenge-my-challenge-detail-ctrl",
  function ($scope, $http, $window, $location, config,variable) {
    $scope.baseurl = config.baseurl;
    $scope.buyformarea = 1;
    $scope.sellformarea = 0;
    $scope.buylist = {
      availableOptions: [
        {id: '1', name: '0.1'},
        {id: '2', name: '0.2'},
        {id: '3', name: '0.3'},
        {id: '4', name: '0.4'},
        {id: '5', name: '0.5'},
        {id: '6', name: '0.6'},
        {id: '7', name: '0.7'},
        {id: '8', name: '0.8'},
        {id: '9', name: '0.9'},
        {id: '10', name: '1'},
        {id: '11', name: '2'},
        {id: '11', name: '3'},
        {id: '11', name: '4'},
        {id: '11', name: '5'},
        {id: '11', name: '30'}
      ]
     };
     $scope.buyform = {}
     $scope.buyform.org_id = 2;
     $scope.buyform.customerId = localStorage.getItem("customerId");
     $scope.buyform.start_datetime = moment().format("YYYY-MM-DD[T]HH:mm:ss");
     $scope.buyform.start_qty = 0;
     $scope.buyform.start_value = 0;
     $scope.buyform.end_datetime = moment().format("YYYY-MM-DD[T]HH:mm:ss");
     $scope.buyform.end_qty = 0;
     $scope.buyform.end_value =  0;
     $scope.buyform.transaction_ref = 'BUY' + moment().unix();
     $scope.buyform.transaction_type = 'BUY';
     $scope.buyform.transaction_status = 'OPEN';
     $scope.buyform.transaction_profitloss = 0;
     $scope.buyform.transaction_duration = 0;

     $scope.sellform = {}
     $scope.sellform.gms = 0
     $scope.sellform.amount = 0   
     $scope.sellform.org_id = 2;
     $scope.sellform.customerId = localStorage.getItem("customerId");
     $scope.sellform.start_datetime = moment().format("YYYY-MM-DD[T]HH:mm:ss");
     $scope.sellform.start_qty = 0;
     $scope.sellform.start_value = 0;
     $scope.sellform.end_datetime = moment().format("YYYY-MM-DD[T]HH:mm:ss");
     $scope.sellform.end_qty = 0;
     $scope.sellform.end_value =  0;
     $scope.sellform.transaction_ref = 'SELL' + moment().unix();
     $scope.sellform.transaction_type = 'SELL';
     $scope.sellform.transaction_status = 'OPEN';
     $scope.sellform.transaction_profitloss = 0;
     $scope.sellform.transaction_duration = 0;
   
    const urlParams = new URLSearchParams($window.location.search);
    $scope.myportfolioId = urlParams.get('myportfolioId');
    console.log( $scope.modelportfolioId );


    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

    
    $scope.init = function (req, res) {
      console.log("portfoliodetailctrl");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");

      if (islogin != "1") {
        location.href = "index.html";
      } else {
       
        $scope.customerId = localStorage.getItem("customerId");
        if( $scope.customerId == 1){
            $("#menu").load("../menu-admin.html"); 
        }else{
            $("#menu").load("./menu.html"); 
        }       
        $("#modals").load("../modals.html"); 
      
      
        $("#general").addClass("active"); 
        $("#modelcategory").addClass("active"); 
        
        $scope.name = localStorage.getItem("name");
        $scope.email = localStorage.getItem('email');
        $scope.phone = localStorage.getItem("phone");
        $scope.getCustomerdemoBalance( $scope.customerId);
        $scope.getCustomerliveBalance( $scope.customerId);
        $scope.getUserPortfolioDetail($scope.myportfolioId);


      }
    
    }



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

        $scope.getUserPortfolioDetail = function (myportfolioId) {

          var data = {}
        data.myportfolioId =  $scope.myportfolioId ;
  
        console.log(data);
          var urlconfig = {
              headers: {
                "Content-Type": "application/json;"
              },
            };
            $http
              .post( $scope.baseurl + variable.modulename + "/getUserPortfolioDetail", data, urlconfig)
              .success(function (response, status, headers, config) {
                $scope.portfolioDetails= response.data ;
                
                console.log($scope.portfolioDetails);

                $scope.getportfolio($scope.portfolioDetails.id);
                $scope.gettransactions($scope.portfolioDetails.id);
                $scope.profitlossbymyportfolioid($scope.portfolioDetails.id);
                $scope.userportfolioaftercalculation($scope.portfolioDetails.id);



              })
              .error(function (data, status, header, config) {
                console.log(data);
              });

        }


        $scope.userportfolioaftercalculation = function (myportfolioId) {

            var data = {}
          data.myportfolioId =  $scope.myportfolioId ;
    
          console.log(data);
            var urlconfig = {
                headers: {
                  "Content-Type": "application/json;"
                },
              };
              $http
                .post( $scope.baseurl + variable.modulename + "/getUserPortfolioDetail", data, urlconfig)
                .success(function (response, status, headers, config) {
                  $scope.portfolioDetails= response.data ;
                  
                })
                .error(function (data, status, header, config) {
                  console.log(data);
                });

        }

        

           

    



    $scope.show_add_stock_modal = function (customerId, myportfolioId, portfolioId,capital,broker) {
      console.log("show_add_stock_modal");
      var data = {}
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };

      
    $scope.addstock = {}
    $scope.addstock.customerId = customerId ;
    $scope.addstock.myportfolioId = myportfolioId ;
    $scope.addstock.portfolioId = portfolioId ;
    $scope.addstock.capital = capital ;
    $scope.addstock.broker = broker ;

    console.log($scope.addstock)
    
    $scope.url = $scope.baseurl + "stockdata/portfolio/" + portfolioId +"/" ;

    $http.get( $scope.url , data, urlconfig)
            .success(function (response, status, headers, config) {
              $scope.stockdata_list = response.data ;
              console.log($scope.stockdata_list) ;
              $("#addstock").modal("show");
          })
          .error(function (response, status, header, config) {
              console.log(response);
              $scope.errormsg = "We were not able to get the stockdata. Please try again after some time.";
              $("#stockdata-issue").modal('show');
          });


      
    };

    $scope.addnewstock = function (data) {
      console.log("addnewstock");
      console.log("customer_id");
      console.log("portfolio_id");
      console.log(addstock);

      if(data.portfolioId == 7){
        data.asset_class = "CRYPTO";
      }else{
        data.asset_class = "STOCK";
      }


      console.log(data);
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
          $http
            .post( $scope.baseurl + variable.modulename + "/addstock", data, urlconfig)
            .success(function (data, status, headers, config) {
              $scope.addstock = data.data ;
              $("#addstock").modal("hide");
              // location.reload();
              $scope.getportfolio(addstock.myportfolioId);
            })
            .error(function (data, status, header, config) {
              console.log(data);
            });
};


$scope.getportfolio = function(myportfolioId) {
  var data = {}
  data.myportfolioId = myportfolioId ;

  console.log(data);
    var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };

      $http
        .post( $scope.baseurl +   variable.modulename + "/getinitialportfolio" , data, urlconfig)
        .success(function (data, status, headers, config) {
          $scope.dataset = data.data ;
          $("#portfoliodetails").removeClass("ng-hide");
        })
        .error(function (data, status, header, config) {
          console.log(data);
          $("#getportfolio-issue").modal('show');
        });

}


$scope.profitlossbymyportfolioid = function(myportfolioId) {

    var data = {}
    data.myportfolio_id = myportfolioId ;
  
    console.log(data);
      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
       
        $http
          .post( $scope.baseurl + variable.modulename + "/profitlossbymyportfolioid" , data, urlconfig)
          .success(function (response, status, headers, config) {
            $scope.pnldata = response.data ;
            console.log($scope.pnldata)
          })
          .error(function (responseerror, status, header, config) {
            console.log(responseerror);
          });
  
  }

  $scope.gettransactions = function(myportfolioId,broker) {

    var data = {}
    data.myportfolio_id = myportfolioId ;
  
    console.log(data);
      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
       
        $http
          .post( $scope.baseurl + variable.modulename +  "/getdemo_trades_By_MyPortfolioId" , data, urlconfig)
          .success(function (response, status, headers, config) {
            $scope.transactionsdata = response.data ;
            console.log($scope.transactionsdata )
          })
          .error(function (data, status, header, config) {
            console.log(data);
            $("#getportfolio-issue").modal('show');
          });
  
  }


  






$scope.editstockmodal = function (customerId,stock_id,symbol,stock_percentage,capital,broker,status) {

  
  console.log("addnewstock")
  $scope.data = {}
  $scope.data.stock_id = stock_id
  $scope.data.symbol = symbol
  $scope.data.percentage = stock_percentage
  $scope.data.status = status
  $scope.data.capital = capital

  console.log($scope.data);
   $("#editstock").modal("show");
};

$scope.editstock = function (customer_id,portfolio_id,data) {
  console.log("editstock")
  console.log(data);
    var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      $http
        .post( $scope.baseurl + + variable.modulename + "/editstock", data, urlconfig)
        .success(function (data, status, headers, config) {
          $scope.edit = data.data ;
          $("#editstock").modal("hide");

          $scope.getportfolio($scope.myportfolioId);
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
};


$scope.deletestockmodal = function (customerId,stock_id,symbol) {
  console.log("addnewstock")

  if(symbol == "ETHUSD" ||  symbol == "BTCUSD"){
          var asset_class = "CRYPTO";
  }else{ var asset_class = "STOCK"; }

  $scope.data = {}
  $scope.data.api_key =  $scope.api_key
  $scope.data.api_secret =  $scope.api_secret
  $scope.data.api_endpoint =  $scope.api_endpoint
  $scope.data.customer_id = customerId
  $scope.data.alpaca_cash = $scope.alpaca_cash
  $scope.data.stock_id = stock_id
  $scope.data.symbol = symbol
   $("#deletestock").modal("show");
};

$scope.deletestock = function (customer_id,portfolio_id,data) {
  console.log("editstock")
  console.log(data);
    var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      $http
        .post( $scope.baseurl + + variable.modulename + "/deletestock", data, urlconfig)
        .success(function (data, status, headers, config) {
          $scope.edit = data.data ;
          $("#deletestock").modal("hide");
          $scope.getportfolio($scope.myportfolioId);
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
};

// This is edit myportfolio section

$scope.editmyportfoliomodal = function (myportfolioId,portfolioName,myportfolio) {
  
  console.log("editmyportfoliomodal")

  $scope.data = myportfolio ;
  console.log($scope.data );
   $("#editmyportfolio").modal("show");
};

$scope.submitmyportfolio = function (data) {
  
  console.log("submitmyportfolio")
  console.log(data);
    var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      $http
        .post( $scope.baseurl + variable.modulename +  "/updateuserportfolio", data, urlconfig)
        .success(function (response, status, headers, config) {
       
          console.log(response.data)
          $scope.portfolioName = response.data.portfolio_name
          $scope.capital = response.data.portfolio_capital

          localStorage.setItem("portfolioName",$scope.portfolioName );
          localStorage.setItem("capital", $scope.capital);
         

          $scope.getportfolio($scope.myportfolioId);
          $("#editmyportfolio").modal("hide");
          
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
};

$scope.showbuy = function () {
  $("#tradearea").removeClass("redtheme");
  $("#tradearea").addClass("bluetheme");

  $scope.buyformarea = 1;
  $scope.sellformarea = 0;
}

$scope.showsell = function () {
  $("#tradearea").removeClass("bluetheme");
  $("#tradearea").addClass("redtheme");

  $scope.buyformarea = 0;
  $scope.sellformarea = 1;

}


var vm = this;
  vm.createtradevalidate = function (data) {
      // Validation for null parameters . Basics
      if (data.start_qty == "") {
        $scope.message = "Please provide a proper Qty.";
        $scope.validate_start_qty = "1";
        return false;
      } else if (data["start_value"] == "") {
        $scope.message = "Please provide the amount.";
        $scope.validate_start_value = "1";
        return false;
      } else if (data["start_value"] > $scope.leveragebalance ){
        $scope.message = "Your balance is low.Please top-up";
        $scope.validate_start_value = "1";
        return false;
      }
      else {
        var confirm = 1;
        return confirm;
      }
    };

$scope.createGoldTrade = function (data) {
  $scope.validateentry = vm.createtradevalidate(data);
  if($scope.validateentry == 1){
    console.log("Buy Gold ");
    $scope.data = data ;
    console.log($scope.data )
    $scope.url = $scope.baseurl + "digitalgold/createGoldTrade" ;
    console.log($scope.url);
    $http.post($scope.url ,$scope.data)
      .success(function (response, status) {
        console.log(response)
        if(response.status == 'success')
         {
              $scope.alertheader = "Alert" ;
              $scope.alertmsg = "You successfully buy";
              $("#buy-success").modal("show");
          }
      })
      .error(function (erroresponse, status) {
        console.log(erroresponse)
      });
  }
};

  $scope.goldgms = function (formdata) {
    $scope.gms = formdata.start_qty ;
    $scope.goldvalue = 52000; //  document.getElementById("lastvalue").innerHTML ;
    $scope.buyform.start_value = $scope.gms * $scope.goldvalue ;
    $scope.sellform.start_value = $scope.gms * $scope.goldvalue ;
  }

    });
