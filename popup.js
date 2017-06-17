var switchersStates = {};





document.addEventListener('DOMContentLoaded', function() {
	var errorsNode = document.getElementById('errors');
	

	

	if(!request.errors) {
		errorsNode.innerHTML = '<p style="padding: 20px">Hold on. Loading.</p>';
		
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
});

