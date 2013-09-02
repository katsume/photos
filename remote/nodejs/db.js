var mongoose= require('mongoose'),
	fs= require('fs');

var DB_HOST= 'localhost',
	DB_NAME= 'pprc',
	HTDOCS_PATH= '../htdocs'
	IMAGE_PATH= '/post_images/';

var ImageSchema= new mongoose.Schema({
	width: Number,
	height: Number,
	name: String,
	heading: Number
});

mongoose.model('Image', ImageSchema);
mongoose.connect('mongodb://'+DB_HOST+'/'+DB_NAME);

var Image= mongoose.model('Image');

var parseDataURL= function(string){
	if(/^data:.+\/(.+);base64,(.*)$/.test(string)){
		return {
			ext: RegExp.$1,
			data: new Buffer(RegExp.$2, 'base64')
		};
	}
	return;
};

exports.index= function(req, res){

	var query= req.query;

	Image.find(
		{},
		null,
		{
			skip: query.offset,
			limit: query.limit,
			sort: {
				_id: -1
			} 
		},
		function(err, images){
			if(err){
				res.json(500, {error: err});
			} else {
				res.json(200, images);
			}
		}
	);
};

exports.create= function(data, callback){

	var parsedData= parseDataURL(data.data),
		image= new Image(),
		imageName= image._id+'.'+parsedData.ext;
	
	image.width= data.width;
	image.height= data.height;
	image.name= IMAGE_PATH+imageName;

	image.save(function(err){
		
		if(err){
			callback(err);
			return;
		}
			
		fs.writeFile(HTDOCS_PATH+IMAGE_PATH+imageName, parsedData.data, function(err){

			if(err){
				callback(err);
				return;
			}
			
			callback(null, image._id, image.name);
		});
	});
};

exports.update= function(data, callback){
	
	var image= Image.findByIdAndUpdate(data.id, {
		heading: data.heading
	}, function(err){
		callback(err);
	});
	
};

exports.destroy= function(req, res){

	Image.remove({}, function(err){
		if(err){
			res.send(500);
		} else {
			res.send(200);
		}
	});
}
