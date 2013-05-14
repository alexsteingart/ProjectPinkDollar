
/*
 * GET home page.
 */
DataAcessProvider = require('../dataAccessProvider-mongodb.js')
var dataTypes = require('../util/dataTypes.js');
var DateHelper = require('../util/dateHelper.js');

var dataAccessProvider = new DataAccessProvider('localhost',27017);


exports.index = function(req,res){
	
	exports.calendar(req, res);
	
	
};



exports.calendar = function(req, res){

	var dt = req.param('asOfDate');
	
	dt = new Date(dt);	
	if(isNaN( dt.getTime())){
		dt = new Date();		
	}
	
	
	dataAccessProvider.getEventsForMonth (dt, function(error, ret){
		
		
		if(error) res.send(error)
		else{
			res.render('calendar.jade',{
				title: 'Project Pink Dollar',
				today: dt,
				calendarFormats: DateHelper.calendarFormats,
				events: ret
			});	
		}
	});	
		
	
};




function getDistinctsForFields(fields, collection, callback){
	
	if(fields){
		var returnedFields=[];
		var objDistincts={};
		
		for(var k=0; k<fields.length; k++){
			var field = fields[k];
			
			
			dataAccessProvider.getUniquesForField(collection, field, function(error,ret){
				if(error) callback(error);
				else{
					returnedFields[returnedFields.length] = field;
					objDistincts[field] = ret;
					if(returnedFields.length == fields.length){
						
						//all async calls have returned, lets go to the page	
						callback(null, objDistincts);
							
						
					}else{
						
						//still waiting for all asyc calls to return	
					}
				}	
				
			});	
		}
	}else{
		callback(null, {});	
	}
}


exports.getNewObject = function(req, res){

	
	
	var objType = req.param('objType');
	if(objType && dataTypes[objType]){
		
		objDesc = dataTypes[objType];
		var obj = objDesc.newForm;
		
		if(obj){
		
			for(var param in req.body){

				if(param!='objAction' && param!='objType'){
					
					obj[param] = req.body[param];
						
				}
			}
			
			
			
			getDistinctsForFields(objDesc.multiSelectFields, objDesc.collection, function(error, objDistincts){
			
				if(error) res.send(error)
				else{res.render(req.param('goToPage')?req.param('goToPage'):'objForm.jade',{
						obj:obj,
						objType:objType,
						objAction:'edit',
						objDistincts:objDistincts
					});
				}		
			});
		}else{
			res.send('object type ' + objType + ' does not contain a new form definition');	
		}		
			
	}else{
		
		res.send('missing or invalid object type when loading new form: ' + objType);	
	}	
	
}



exports.getDBObject = function(req, res){
	
	var objType = req.param('objType');
	dataAccessProvider.getDBObject(req.param('_id'), objType, function(error, dbObject){
		if(error) res.send(error);
		else{
			
			var objDesc = dataTypes[objType];
			
			//do some getting for 'finite fields' using get unique fields function
			
			var objDistincts = {};
			
			console.log(dbObject);
			
			getDistinctsForFields(objDesc.multiSelectFields, objDesc.collection, function(error, objDistincts){
							
				if(error)res.send(error)
				else {
					res.render(req.param('goToPage')?req.param('goToPage'):'objForm.jade',{
					
						obj: dbObject,
						objType: objType,
						objAction: req.param('objAction'),
						objDistincts: objDistincts
					
					});				
				}
				
			});
				
			
			
			
				
		}
		
	});
	
}

exports.doEditObject = function(req, res){
	var objToSubmit = {};
	
	var tp = req.body.type;
	
	if(tp){
		var dt = dataTypes[tp];
		if(!dt) dt = {};
		
		for(var param in req.body){
			console.log(param + ": " + req.body[param]);	
			
			if(dt.dates && dt.dates[param]){
				objToSubmit[param] = new Date(req.body[param] + (req.body[param].indexOf('GMT')>-1?'':' GMT-400'));	
				console.log(objToSubmit[param]);
			}else{	
				objToSubmit[param] = req.body[param];
			}
		}
		
		dataAccessProvider.saveDBObject(tp, objToSubmit, function(error){
			
			if(error) res.send(error);
			else{
				res.send('done');		
			}	
			
		});
			
		
	}
	
	res.send('error');
		
}

