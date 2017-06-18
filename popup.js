var switchersStates = {};


function sendToServer(error) {
	$.ajax({
		url: 'http://localhost:3000/solutions',
		type: 'post',
		data: 'error=' + error,
		dataType: 'json',
		success: function(data) {
			$(".fa-refresh").hide();
			$(".solution").html(data.answer);
		},
		error: function(a,b,c) {
			console.log(c);
		}
	});
}





document.addEventListener('DOMContentLoaded', function() {
	var errorsNode = document.getElementById('errors');
	

	if(!request.errors) {
		errorsNode.innerHTML = '<p style="padding: 20px">There are no errors on this page :(</p>';
		copyNode.remove();
		clearNode.remove();
	}
	else {
		errorsNode.innerHTML = request.errors;

		
	}

	window.addEventListener('message', function(event) {
		if(typeof event.data == 'object' && event.data._reloadPopup) {
			request = parseUrl(event.data.url);
			errorsNode.innerHTML = request.errors;
			
			setTimeout(autoSize, 100);
		}
	});


	$(document).on('click','.so',function(){
		$("#errors").fadeOut();
		$(".solution").fadeIn();
		sendToServer($(this).parent().parent().data('error'));
	})
});

