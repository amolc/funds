#!/bin/bash
cp service.server-c1.js  web/angular/service.js
npm install

echo "killing the quantfunds.js"
ps -ef | grep "node quantfunds.js" | grep -v runstatic | awk '{print $2}' | xargs kill -9
echo "Restarting Service"
node quantfunds.js
echo "Service started at port 31000"
