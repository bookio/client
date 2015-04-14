
(function() {
	
    
    Parser = {};
    
    
    function containsNumber(str) {
		return (str.match(/\d+/g) != null);
    }
    
    
	Parser.isEmail = function(text) {
		var regexp = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
		
		return text.match(regexp);
	}
	
	Parser.isPhoneNumber = function(text) {
		//var regexp = /^0[0-9]{1,3}\s*-\s*\d{2,3}\s*\d{2,3}\s*\d{2,3}$/g;
		var regexp = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i;
		// Remove blanks and dont allow numbers longer than 20 digits
		return text.replace(/ /g,'').match(regexp) && (text.replace(/ /g,'').length < 20);
	}

	Parser.isLastName = function(text) {
		var regexp = /^[A-ZÅÄÖ][a-zåäöé]*(berg|son|sen|ström|stedt|fält|feldt|fors|qvist|én|ér|kvist|stig|din|skog|rot|sund|man|mann|hoff|mark|hill|holm|vall|wall|enius|ander|ling|lund|sten|sjö|ell)$/g;
		return text.match(regexp);
	}
/*
	Parser.isName = function(text) {

    	var words = text.split(/[\s-]/);
    	var lastNames = 0;
    	
    	$.each(words, function(index, word) {
        	if (Parser.isLastName(word))
        	   lastNames++;
    	});
    	
		return lastNames > 0;
	}*/

	Parser.isName = function(text) {
		var noNumbers = true;
    	var words = text.split(/[\s-]/);
    	
    	$.each(words, function(index, word) {
        	if (containsNumber(word)) {
				noNumbers = false;
				return false;	        	
        	}
    	});

		return (noNumbers && words.length < 5);
	}
	
	Parser.isStreetAddress = function(text) {
		var regexp = /^([A-ZÅÄÖ][a-zåäöé]{2,}\s*)+\d+\s*[A-Z]{0,1}$/g;
		return text.match(regexp);
	}
	
	Parser.isStreetName = function(text) {
		var regexp = /^([A-ZÅÄÖ][a-zåäö]+[-\s]+)*([A-ZÅÄÖ][a-zåäöé])*([Vv]äg(en)*|[Gg]atan|[Gg]ränd|[Ss]tigen|[Rr]ingen)(\s+\d*\s*[A-Z]{0,1}){0,1}$/g;
		return text.match(regexp);    	
	}
	
	Parser.isAddress = function(text) {
    	var words = text.split(/[\s-]/);
    	var wordCount = words.length;    	
    	var onlyNumbers = true;

    	$.each(words, function(index, word) {
        	if (!$.isNumeric(word)) {
				onlyNumbers = false;
				return false;	        	
        	}
    	});
    	    	
		return wordCount < 5 && !onlyNumbers;
	}	

	Parser.isTwitter = function(text) {
		var regexp = /^(\@)?[A-Za-z0-9_]+$/;
		
		return text.match(regexp) && (text.charAt(0) == '@');
	}
	
	Parser.wordCountGreaterThan = function(text, count) {
    	var words = text.split(/[\s-]/);
    	var wordCount = words.length;
    	
    	return wordCount > count;
	}
	
	Parser.isFoo = function(text) {
	
		var regexp = /^0(\d{1,3})\s*-\s*(\d{3})(\d{3})*(\d{3})*(\d{2})*(\d{2})*$/g;
		var x = text.replace(regexp, "+46 0$1-$2 $3 $4 $5 $6");
		console.log('lfdkg: ' + x);
		return false;
    	
	}

    Parser.parse = function(text) {
    	if (Parser.isEmail(text))
    	    console.log(text + ' is email');
        if (Parser.isPhoneNumber(text))
            console.log(text + ' is phonenumber');
        if (Parser.isStreetAddress(text))
            console.log(text + ' is street address');
        if (Parser.isStreetName(text))
            console.log(text + ' is street name');
        if (Parser.isLastName(text))
            console.log(text + ' is a last name');
        if (Parser.isName(text))
            console.log(text + ' is a name');
        if (Parser.isFoo(text))
            console.log(text + ' is fooo');
    }
    	    
    return Parser;

})();


