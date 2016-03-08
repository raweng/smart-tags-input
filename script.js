document.addEventListener('DOMContentLoaded', function(){
	var tagInput = new SmartTagsInput("testTagInput");
	var options = {
		value:'This is a {{smart tags}}',
		isInputTag:false
	}
	tagInput.init(options);
}, false);
