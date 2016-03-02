document.addEventListener('DOMContentLoaded', function(){
	var tagInput = new SmartTagsInput("testTagInput");
	var options = {
		value:'this is a {{smart tags input}}'
	}
	tagInput.init(options);
}, false);
