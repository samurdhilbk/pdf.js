function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

var selectedText;

document.onmouseup = document.onkeyup = document.onselectionchange = function() {
  //document.getElementById("sel").value = getSelectionText();
  selectedText = getSelectionText().trim();
};

function apiReachable() {

	if(navigator.onLine){
		return true;
	} else {
		return false;
	}

}

function ajax_callback(data){
	console.log(data);

	$("#dict-term").text(selectedText);

	if (typeof data.tuc == 'undefined') {
		$("#dict-definition-list").html('');
		$("#dict-definition-list").append("<div class='def-item'><div class='def-description'>No meaning found for the word <strong><i>"+ selectedText +"</i></strong></div></div>");
		$('.ui.modal').modal('show');
		return;
	}

	var meanings = data.tuc[0]["meanings"];

	console.log(meanings.length);

	$("#dict-definition-list").html('');

	for (var i = 0; i < Math.min(10, meanings.length); i++) {
		var meaning = meanings[i];
		console.log(meaning["text"]);

		$("#dict-definition-list").append("<div class='def-item'><div class='def-index'>"+ (i+1)+".</div><div class='def-description'>"+ meaning["text"] +"</div></div>");
	};

	$('.ui.modal').modal('show');
}

function doc_keyUp(e) {
    if (e.ctrlKey && e.altKey && e.which == 67) {
        console.log(selectedText);

        if(!apiReachable()){
        	$("#dict-definition-list").html('');
        	$("#dict-term").text("Host unreachable");
        	$("#dict-definition-list").append("<div class='def-item'><div class='def-description'><i>Error in network connection.</i></div></div>");
			$('.ui.modal').modal('show');
			return;
        }

		var script = document.createElement('script');

		var url = 'https://glosbe.com/gapi/translate?from=eng&dest=eng&format=json&phrase='+ selectedText +'&pretty=true&callback=ajax_callback';

		script.src = url;

		document.getElementsByTagName('head')[0].appendChild(script);
    }
}
document.addEventListener('keyup', doc_keyUp, false);

var ajax = {};
ajax.x = function () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];

    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }
    return xhr;
};

ajax.send = function (url, callback, method, data, async) {
    if (async === undefined) {
        async = true;
    }
    var x = ajax.x();
    x.open(method, url, async);
    x.onreadystatechange = function () {
        if (x.readyState == 4) {
            callback(x.responseText)
        }
    };

    if (method == 'POST') {
        //x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        x.setRequestHeader('Accept', 'application/json');
        x.setRequestHeader('app_id', '0ff1a9bf');
        x.setRequestHeader('app_key', '4dc1aebaa63721f0f8e79a55e2514bc7');
    }
    x.send(data)
};

ajax.get = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};

ajax.post = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url, callback, 'POST', query.join('&'), async)
};