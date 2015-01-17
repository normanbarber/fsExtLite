var path = require('path');
var fs = require('fs');
var Q = require('q');
var _ = require('lodash-node');

var fsmodule = {
	filepaths: [],
	filedata: [],
	getStats: function(){
		var all = [];
		var promise = null;
		var self = this;
		var files = this.filepaths.splice(0, 20);  // prevents memory allocation error. comment this line to see error when reading C:/ drive or another folder with a lot of files
//        var files = this.filepaths;  // uncomment this line to see error
		_.each(files,function(filepath){
			var fileformat = path.extname(filepath);
			var year;

			promise = Q.nfcall(fs.stat, filepath)
				.then(function(stats) {
					if(stats && stats.mtime && fileformat){
						year = stats.mtime.getFullYear();

						var findtype = _.find(self.filedata,{format:fileformat});
						if(findtype && year >= 2010){
							_.remove(self.filedata,{format:fileformat});
							self.filedata.push({format:fileformat, count:findtype.count+1});
						}
						else if(year >= 2010 || self.filedata.length <= 0)
							self.filedata.push({format:fileformat,count:1})

					}
					return Q(self.filedata);
				})
				.fail(function(error){
					return Q.reject(error);
				})
		})

		all.push(promise);
		return Q.allSettled(all)
			.then(function(promises) {
				return Q(_.map(promises, Q.nearer));
			})
			.fin(function(){
				// IMPORTANT : if you comment the splice() to see the memory allocation error you will need to comment this fin too
				if(self.filepaths.length > 0){
					return Q(fsmodule.getStats());
				}
			})
	}
}
module.exports = function(readfilepaths) {

	return function() {
		console.log('\nstep 2 0f 3: reading file stats. pleast wait...\n')
		fsmodule.filepaths = readfilepaths;

		return fsmodule.getStats()
			.fail(function(error) {
				return Q.reject(error);
			})
			.then(function(data) {
				console.log(JSON.stringify(data[0].value));
			});
	}
};