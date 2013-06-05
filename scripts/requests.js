




function assert(test)
{
    if (!test) {
        debugger;
    }
}

function httpLogin(url, email, password, yes, no) {
		
	var beforeSend = function(xhr) {
		xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(email + ':' + password));
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("Accept", "application/json");
	}
	
	var success = function(data, textStatus, xhr) {
		yes(data);
			
	}
	
	var error = function(xhr, textStatus, errorThrown) {
    	
    	try {
        	var response = JSON.parse(xhr.responseText)

        	if (no !== undefined)
        	   no(response)
    	}
    	catch (error) {
        	alert(error);
    	}
		
	}
	
	$.ajax ({type:'GET', url: url, data:null, dataType: 'json', beforeSend:beforeSend, success:success, error:error});
}

function httpRequest(method, url, data, yes, no) {
		
	var beforeSend = function(xhr) {
		//xhr.setRequestHeader("Authorization", "Basic " + Base64.encode("magnus@app-o.se:potatismos"));
		xhr.setRequestHeader("Authorization", bookio.sid);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("Accept", "application/json");
	}
	
	var success = function(data, textStatus, xhr) {
		yes(data);
			
	}
	
	var error = function(xhr, textStatus, errorThrown) {
    	
    	try {
        	var response = JSON.parse(xhr.responseText)

        	if (no !== undefined)
        	   no(response)
    	}
    	catch (error) {
        	alert(error);
    	}
		
	}

	$.ajax ({type:method, url: url, data:data == null ? null : JSON.stringify(data), dataType: 'json', beforeSend:beforeSend, success:success, error:error});
}


function httpGet(theUrl)
{
	var xmlHttp = null;
	
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false );
	xmlHttp.send( null );

	return JSON.parse(xmlHttp.responseText);
}

function httpDelete(theUrl)
{
	var xmlHttp = null;
	
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "DELETE", theUrl, false );
	xmlHttp.send(null);
}

function httpPost(theUrl, params)
{
	var xmlHttp = null;
	
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "POST", theUrl, false );
	xmlHttp.setRequestHeader("Content-Type", "application/json");
	xmlHttp.setRequestHeader("Accept", "application/json");
	xmlHttp.setRequestHeader("Authorization", "Basic " + Base64.encode("magnus@app-o.se:potatismos"));
	xmlHttp.send(JSON.stringify(params));

	return JSON.parse(xmlHttp.responseText);
}

