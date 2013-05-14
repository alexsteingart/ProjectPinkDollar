var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var exec = require("child_process").exec;
var mongoose = require('mongoose');
var dataTypes = require('./util/dataTypes.js');

DataAccessProvider = function(host, port) {
  //this.db= new Db('projectPinkDollar', new Server(host, port, {auto_reconnect: true}, {}));
  this.db= new Db('projectpinkdollar', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(err, db){
	db.authenticate('testadmin', 'test123', {}, function(){});
  
  });
};
/*DataAccessProvider = function(host, port) {
	var tmp;
	this.db = tmp;
  Db.connect("mongodb://testadmin:test123@"+host+":"+port, function(err,conn){
	
tmp = conn;
	  //this.db.open(function(){});
  });
};
*/




DataAccessProvider.prototype.getEventsForMonth = function(ed, callback){
	this.db.collection('events', function(error, collection){
		collection.find({eventDate:{$gte:new Date(ed.getFullYear(), ed.getMonth(), 1), $lt:ed.getMonth()==11?new Date(ed.getFullYear()+1,1,1):new Date(ed.getFullYear(),ed.getMonth()+1,1)}}).toArray(function(error, ret){
			if(error) callback(error);
			else {
				
				var newRet = {};	
				//go through all returned results.  for each entry, see if we already found something that day
				//if so, add it to the array of events for that day, otherwise, create array.
				for(var k=0; k<ret.length; k++){
					var dt = ret[k].eventDate;
					var tmp = newRet[dt.getDate()];
					if(!tmp){
						tmp = [ret[k]]	;
					}else{
						tmp[tmp.length] = ret[k];	
					}	
					newRet[dt.getDate()] = tmp;
				}
				
				callback(null, newRet);
			}
		});
	});	
}

DataAccessProvider.prototype.getUniquesForField = function(collection, field, callback){
	
	this.db.collection(collection, function(error, collection){
		collection.distinct(field,function(error, ret){
			if(error) callback(error);
			else{
				
				callback(null, ret);
				
			}			
		});
	});
}	
	
DataAccessProvider.prototype.getDBObject = function(id, objType, callback){
	
	this.db.collection(dataTypes[objType].collection, function(error, collection){
		collection.findOne({'_id':collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, ret){
				if(error) callback(error);
				else{
					callback(null, ret);	
				}		
		
			})
	});
		
}

DataAccessProvider.prototype.saveDBObject = function(dataType, objToSave, callback){
		
	this.db.collection(dataTypes[dataType].collection, function(error, collection){
			if(objToSave['_id']){
				objToSave['_id'] = collection.db.bson_serializer.ObjectID.createFromHexString(objToSave['_id']);	
				
			}
			collection.save(objToSave, function(error){
				
				callback(error);
					
			});
			
	});
	
}

exports.DataAccessProvider = DataAccessProvider;