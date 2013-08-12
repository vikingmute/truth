var mongo = require('mongodb');
var crypto = require('crypto');
var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {w:1});
db = new Db('userdb', server);
 
db.open(function(err, db) {
	if(!err) {
		console.log("Connected to 'userdb' database");
		db.collection('users', {strict:true}, function(err, collection) {
			if (err) {
				console.log("The 'users' collection doesn't exist. Creating it with sample data...");
			}
		});
	}
});
 

exports.addUser = function(req, res) {
	//check the password
	if(req.body.pwd != req.body.rpwd){
		req.flash('info','两次输入的密码不一致!'); 
		return res.redirect('/signup');
	}
	var user = {};
	user.email = req.body.email;
	var md5 = crypto.createHash('md5');
    user.password = md5.update(req.body.pwd).digest('hex');
	//check user exists
	db.collection('users',function(err,collection){
		collection.findOne({email:req.body.email},function(err,doc){
			if(doc){
				console.log('already has this username');
				req.flash('info','the user email has already taken');
				res.redirect('/signup');
			}else{
				console.log('Adding user: ' + JSON.stringify(user));
				collection.insert(user, {safe:true}, function(err, result) {
					if (err) {
						res.send({'error':'An error has occurred'});
					} else {
						console.log('Success: ' + JSON.stringify(result[0]));
						req.flash('info','sign up complete, please login!');
						res.redirect('/login');
					}
				});
			}
		})
	})
} 

exports.userLogin = function(req, res){
	var user = {};
	user.email = req.body.email;
	var md5 = crypto.createHash('md5');
    user.password = md5.update(req.body.pwd).digest('hex');
    db.collection('users',function(err,collection){
    	collection.findOne({email:req.body.email},function(err,doc){
    		if(doc){
    			if(doc.password != user.password){
	    			req.flash('info','The password is wrong');
	    			res.redirect('/login');
    			}else{
    				req.session.useremail = doc.email;
    				res.redirect('/');
    			}
    		}else{
    			req.flash('info','This accont is not exist');
    			res.redirect('/login');
    		}
    	})
    })
}