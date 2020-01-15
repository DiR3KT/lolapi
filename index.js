var express = require('express');
var request = require("request");
var cors = require('cors');
var app = express();

var port = process.env.PORT || 80; //Useful for Heroku hosting
var api_key = process.env.api_key; //Your API key from Riot

app.use(cors()); //Disables CORS
app.use(express.static("public"));

//Gives index.html on "/" call
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/html/index.html");
});

//API call: champion rotation.
app.get('/championRotation', function(req, res){
  request('https://euw1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key='+api_key, function (error, response, body) {
    res.jsonp(JSON.parse(body));
  })
})

//API call: summoner data.
app.get('/getData/:region/:name', function(req, res){
    var region = req.params.region;
    var name = req.params.name;
    if (region == "euw") {
      region = "euw1";
    }
    URL = "https://"+region+".api.riotgames.com/lol/summoner/v4/summoners/by-name/"+name+"?api_key="+api_key;
    request(URL, function (error, response, body) {
      res.jsonp(body);
    })
})

//API call: summoner rank.
app.get('/getRank/:region/:id', function(req, res){
	var region = req.params.region;
	var id = req.params.id;
	if (region == "euw") {
		region = "euw1";
	}
	URL = "https://"+region+".api.riotgames.com/lol/league/v4/positions/by-summoner/"+id+"?api_key="+api_key;
	request(URL, function (error, response, body) {
      res.jsonp(body);
  })
})

//API call: game history.
app.get('/getHistory/:region/:id/:beginIndex/:endIndex', function(req, res){
  var region = req.params.region;
  var id = req.params.id;
  var beginIndex = req.params.beginIndex;
  var endIndex = req.params.endIndex;
  if (region == "euw") {
		region = "euw1";
	}
  else{
    URL = "https://"+region+".api.riotgames.com/lol/match/v4/matchlists/by-account/"+id+"?api_key="+api_key+"&beginIndex="+beginIndex+"&endIndex="+endIndex;
    request(URL, function (error, response, body) {
        res.jsonp(body);
    })
  }
})


//Starts the server.
app.listen(port, function(){
  console.log("Node is listening on port "+port+"!");
});
