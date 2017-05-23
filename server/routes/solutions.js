var express = require('express');
var router = express.Router();

var striptags = require('striptags');

var google = require('google');

var zlib = require("zlib");
var http = require('http');

router.checkAndScrapeGoogle = function(req,res) {
	google.resultsPerPage = 10;
	var ERROR = striptags(req.body.error,'<br/>');
	var link = null;
	// var allAnswers
	google(ERROR,function(err,res){

		for(var i = 0;i < res.links.length;i++) {
			link = res.links[i].href;
			console.log(link);
			if(link.indexOf("stackoverflow.com") !== -1)
				break;		
			
		}
		if(link !== null)
			router.getGzipped('http://api.stackexchange.com/2.2/questions/' + router.getQuestionIdFromLink(link) + '/answers/?order=desc&sort=activity&site=stackoverflow', function (err, data) {
				if(err){
					console.error(err);
				}
				else{
					
				}
			});

		


	});


	
};




router.getGzipped = function(url, callback) {
    // buffer to store the streamed decompression
    var buffer = [];

    http.get(url, function (res) {
        // pipe the response into the gunzip to decompress
        var gunzip = zlib.createGunzip();
        res.pipe(gunzip);

        gunzip.on('data', function (data) {
            // decompression chunk ready, add it to the buffer
            buffer.push(data.toString())

        }).on("end", function () {
            // response and decompression complete, join the buffer and return
            callback(null, buffer.join(""));

        }).on("error", function (e) {
        	callback(e);
        })
    }).on('error', function (e) {
    	callback(e)
    });
};



router.getQuestionIdFromLink = function(link) {

	link = link.split('/');
	console.log(JSON.stringify(link));
	return link[4];

};

module.exports = router;