var mongoose= require('mongoose');

var ImageSchema= new mongoose.Schema({
	width: Number,
	height: Number
});

mongoose.model('Image', ImageSchema);
mongoose.connect('mongodb://localhost/pprc');

var Image= mongoose.model('Image');

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

exports.create= function(data){

	var image= new Image(data);

	image.save();	

	return image._id;
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
