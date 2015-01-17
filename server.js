var express = require('express');
var walk = require('walkdir');
var fsext = require('./fsext.js');

var app = express();
var startTime;
var endTime;
var readpath = 'path/to/read/folder';

app.set('port', process.env.PORT || 8000);

app.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
	startTime = new Date();
	walker.walkDir(readpath,function(files){
		fsext(files)()
			.fin(function(){
				console.log('\nstep 3 0f 3: returning performance results')
				endTime =  new Date();
				var totalTime = endTime - startTime;
				var ms = totalTime;
				var minutes = (ms/1000/60) << 0;
				var seconds = ((ms/1000) % 60) * 100;
				seconds = ~~seconds / 100;
				console.log(minutes + ' minutes : ' + seconds + ' seconds');
			})
			.fail(function(error){
				console.log('There was an error thrown while walking your folder structure');
				console.log(error);
			})
	});
});

var walker = {
	walkDir: function(readpath,callback){
		console.log('\nstep 1 of 3: walking folder and sub-folders. pleast wait...\n');
		var files = [];
		walk(readpath, function(file){
			files.push(file);
		})
		.on('error',function(error){
			console.log('\nThe folder you are trying to read from is either misspelled or does not exist');
			console.log('This is the path causing the error = ' + error);
		})
		.on('end',function(){
			return callback(files);
		})
	}
}

