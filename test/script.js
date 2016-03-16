document.addEventListener('DOMContentLoaded', function(){
	var tagInput = new SmartTagsInput("testTagInput");
	var options = {
		value:'This is a {{smart tags}}',
		isInputTag:true,
		onChange:function(e){console.log('onChange',e)}
	}
	tagInput.init(options);
}, false);
