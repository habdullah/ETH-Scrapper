/*
 * Import express and request promise 
 */
// Import Express and request
const request = require('request-promise');
const bodyParser = require('body-parser');
const express = require('express');
const { type } = require('os');

/*
 * Set App variables 
 */
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.set("views", __dirname + "/views");
app.set("view engine", "pug");

/*
 * Add entry route
 */
app.get("/", function (request, response){
  response.render("index", {tx: ""});
});

/*
 * Add route for fetching data from API
 */
app.post('/get', function(req, res){
  (async () => {
    console.log("New request recieved");
    txdata = await request.post({url: 'https://api.etherscan.io/api', 
      form: { 
        module: 'account',
        action: 'txlist',
        address:  req.body.address,
        startblock: req.body.floor,
        endblock: req.body.ceiling,
        sort: 'asc',
        apikey: req.body.apikey
        }
      }, 
      function(error, response, _body){
        if(error){
          console.log(error.message);
        }
        return response.body;
      });
    if(typeof txdata == 'undefined'){
      txdata = "No records";
    }
    txdata = JSON.parse(txdata);
    console.log("Request fullfilled.")
    res.render("index", { 'txdata': txdata });
  })();
});

app.listen(8080);
console.log("Server started");
