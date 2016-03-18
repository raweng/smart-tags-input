document.addEventListener('DOMContentLoaded', function(){
	var tagInput = new SmartTagsInput("testTagInput");
	var options = {
		value:'This is a {{smart tags}}',
		isInputTag:false,
		onChange:function(e){console.log('onChange',e)}
	}
	tagInput.init(options);
}, false);
