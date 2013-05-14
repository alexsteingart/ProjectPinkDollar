
function displayElementToRightOfTrigger(divid, event){
	
	var el=event.fromElement;
	if(!el)el=event.originalTarget;
	
	var x = el.offsetLeft + el.offsetWidth-15 
	var y = event.pageY
		
	var dv = document.getElementById(divid);
	dv.style['left']=x + 'px';
	dv.style['top']=y + 'px';
	dv.style.display='';
	dv.isHovered=true;

}

function hideElement(divid){
	var dv = document.getElementById(divid)
	dv.isHovered=false;
	
	setTimeout('doHide("'+divid+'");',500);
}

function doHide(divid){
	var dv = document.getElementById(divid)
	if(!dv.isHovered)
		dv.style.display='none';	
}



function getNewObject(objType, defaults){
	var params = {};
	if(defaults){
		params = defaults;
	}
	params['objAction'] = 'new';
	params['objType'] = objType;
	$('#functionalOverlay').load('/getNewObject', params, function(responseText, textStatus, XMLHttpRequest){
		$('#functionalOverlayParent').css({'display':''});
	});		
}

function getDBObject(id,objAction, objType){
	$('#functionalOverlay').load('/getDBObject', {'_id':id, objAction:objAction, objType:objType}, function(responseText, textStatus, XMLHttpRequest){
		$('#functionalOverlayParent').css({'display':''});
	});		
		
}

function submitForm(formId, destinationDivId, callback, callbackParams){

	var frm = $("#" + formId);
	var dv = $("#" + destinationDivId);
	if(frm && frm[0] && dv){
		dv.load( frm[0].action, frm.serializeArray(), function(responseText, textStatus, XMLHttpRequest){
			if(callback){
				callback(callbackParams);
			}
		});			
	}
			
}