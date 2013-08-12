var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var Books = function(host, port) {
  this.db= new Db('node-vbooks', new Server(host, port,  {w: 1}));
  this.db.open(function(){});
};


Books.prototype.getCollection= function(callback) {
  this.db.collection('books', function(error, employee_collection) {
	if( error ) callback(error);
	else callback(null, employee_collection);
  });
};

//find all employees
Books.prototype.findAll = function(callback) {
	this.getCollection(function(error, employee_collection) {
	  if( error ) callback(error)
	  else {
		employee_collection.find().toArray(function(error, results) {
		  if( error ) callback(error)
		  else callback(null, results)
		});
	  }
	});
};

//save new employee
Books.prototype.save = function(book, callback) {
	this.getCollection(function(error, employee_collection) {
	  if( error ) callback(error)
	  else {
		book.created_at = new Date();
		employee_collection.insert(book,{safe:true}, function(err,result) {
		  callback(err, result);
		});
	  }
	});
};

exports.Books = Books;