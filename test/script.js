document.addEventListener('DOMContentLoaded', function(){
	var tagInput = new SmartTagsInput("testTagInput");
	var options = {
		value:'this is a {{smart tags input}}',
		onFocus:function(e){console.log('onFocus',e)},
		isInputTag:true,
		inputType:'hidden'
	}
	tagInput.init(options);
}, false);
