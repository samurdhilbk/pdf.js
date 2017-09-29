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

	$("#dict-term").text(selectedText);

	if (typeof data.tuc == 'undefined') {
		$("#dict-definition-list").html('');
		$("#dict-definition-list").append("<div class='def-item'><div class='def-description'>No meaning found for the word <strong><i>"+ selectedText +"</i></strong></div></div>");
		$('.ui.modal').modal('show');
		return;
	}

	var meanings = data.tuc[0]["meanings"];

	$("#dict-definition-list").html('');

	for (var i = 0; i < Math.min(10, meanings.length); i++) {
		var meaning = meanings[i];
		$("#dict-definition-list").append("<div class='def-item'><div class='def-index'>"+ (i+1)+".</div><div class='def-description'>"+ meaning["text"] +"</div></div>");
	};

	$('.ui.modal').modal('show');
}

function doc_keyUp(e) {
    if (e.ctrlKey && e.altKey && e.which == 67) {
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