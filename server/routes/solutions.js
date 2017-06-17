var express = require('express');
var router = express.Router();

var striptags = require('striptags');

var google = require('google');

var zlib = require("zlib");
var http = require('http');



router.checkAndScrapeGoogle = function(req,response) {
	
	google.resultsPerPage = 10;
	var ERROR = striptags(req.body.error,'<br/>');
	var link = null;
	
	var answerContent = null;


	google(ERROR,function(err,res){

		for(var i = 0;i < res.links.length;i++) {
			link = res.links[i].href;
			console.log(link);
			if(link.indexOf("stackoverflow.com") !== -1)
				break;		
			
		}
		if(link !== null)
			router.getGzipped('http://api.stackexchange.com/2.2/questions/' + router.getQuestionIdFromLink(link) + '/answers/?order=desc&sort=votes&min=1&max=10&site=stackoverflow&filter=!9YdnSMKKT', function (err, data) {
				if(err){
					console.error(err);
				}
				else{
					data = JSON.parse(data);
					
					var allAnswers = data.items;

					var allAnswersCount = data.items.length;



					for(var i = 0;i < allAnswersCount;i++)
					{
						if(allAnswers[i].isAccepted) {
							
							answerContent = allAnswers[i].body;
							break;
						}

					}

					if(answerContent === null) 						
						answerContent = allAnswers[0].body;					

					response.json({answer: answerContent});
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