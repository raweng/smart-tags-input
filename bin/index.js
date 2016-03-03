var SmartTagsInput = function (obj){

	this.obj = obj;

	this.innerWrapper = null;

	this.textarea = null;

	this.div = null;

	this.options = {
		startLimit : '{{',
		endLimit : '}}',
		onChange : function(e){
		},
		value:''
	};

	this.init = function(options){
		options = options || {};
		optionsMerge.call(this,options)
		if(typeof(this.obj) === 'string'){
			var wrapper = document.getElementById(this.obj);			
		}else if (this.obj instanceof(Element)) {
			var wrapper = this.obj;
		}else{
			throw new Error('contructor should be initialized with element id or the element itself.');
		}
		if(wrapper){
			
			var innerWrapper = document.createElement('div');
			innerWrapper.className = "tags-input-wrapper";
			wrapper.appendChild(innerWrapper);
			this.innerWrapper = innerWrapper;

			var textarea = document.createElement('textarea');
			textarea.className = "tags-input-textarea tags-input";
			textarea.value = this.options.value;
			textarea.autofocus = true;
			this.textarea = textarea;


			var div = document.createElement('div');
			div.className = "tags-input-div tags-input";
			this.div = div;

			innerWrapper.appendChild(textarea);
			innerWrapper.appendChild(div);
			// this.textarea.focus();
			addListners.call(this);

		}

	}

	var optionsMerge = function(options){
		for (key in this.options) {
			this.options[key] = options[key] || this.options[key]
		}
	}

	var addListners = function(){
		this.textarea.addEventListener('blur', onTextAreaBlur.bind(this));
		this.textarea.addEventListener('input', this.options.onChange);
		this.textarea.addEventListener('focus', onTextAreaFocus.bind(this));
		this.textarea.addEventListener('keydown', onKeyDown.bind(this));
		this.textarea.addEventListener('keyup', onKeyUp.bind(this));
	}

	var onTextAreaFocus = function(e){
		this.div.style.opacity = '0';
		this.textarea.style.opacity = '1';
		// this.textarea.focus();
	}

	var onTextAreaBlur = function(e){
		parse.call(this,e.currentTarget.value);
		e.currentTarget.style.opacity = '0';
		this.div.style.opacity = '1';
	}

	var onKeyDown = function(e){
		if (e.keyCode === 8 || e.keyCode === 46) {
			var val = this.textarea.value;
			var end = this.textarea.selectionEnd;
			var start = this.textarea.selectionStart;

			var regExp = new RegExp(this.options.startLimit+'(.*?)'+this.options.endLimit,'g')
			var parsedMatchArray = val.match(regExp);
			if(parsedMatchArray){
				e.preventDefault();
				var output = val;
				if(end === start){
					if(e.keyCode === 8){
						if(start !==0){
							output = validator.call(this,parsedMatchArray,val,(start-1),(start-1))	
						}
					}else{
						if(end !== val.length){
							output = validator.call(this,parsedMatchArray,val,(end),(end))	
						}
					}
				}else{
					if(start < end){
						output = validator.call(this,parsedMatchArray,val,(start),(end-1))
					}else{
						output = validator.call(this,parsedMatchArray,val,(end),(start-1))
					}
				}

				this.textarea.value = output.newValue;
				this.setCursorPosition(output.cursorPosition);
			}

		}		
		setTimeout( TextareaHeightHandler.bind(this), 0);
		if ( e.keyCode === 8 || e.keyCode === 46) {
			this.textarea.style.height = 'auto';
			this.textarea.style.height = this.textarea.scrollHeight+'px';
		}
		
	}

	var onKeyUp = function(e){
		// TextareaHeightHandler.call(this);
	}

	var TextareaHeightHandler = function(){
		var editableArea = this.textarea;
		// editableArea.style.height = 'auto';
		var editableAreaHeight = editableArea.scrollHeight,
			style = window.getComputedStyle(editableArea),
    		top = style.getPropertyValue('padding-top'),
    		paddingTop = Number(top.substr(0, top.length-2)),
    		bottom = style.getPropertyValue('padding-bottom'),
    		paddingBottom = Number(bottom.substr(0, bottom.length-2));
		var finalHeight = editableAreaHeight - paddingTop - paddingBottom;
		editableArea.style.height = finalHeight+"px";
		this.innerWrapper.style.height = finalHeight+"px";
	}

	var validator = function(parsedMatchArray,val,startIndex,endIndex){
		var deleteStart = startIndex,
			deleteEnd = endIndex +1,
			startRegEx = new RegExp('^'+this.options.startLimit),
			endRegEx = new RegExp(this.options.endLimit+'$');
		for (key in parsedMatchArray) {

			var len = parsedMatchArray[key].length;
			var valIndex = val.indexOf(parsedMatchArray[key]);

			var lenWithoutDelimiter = parsedMatchArray[key].replace(startRegEx, '').replace(endRegEx, '').length;
			var valIndexWithoutDelimiter = val.indexOf(parsedMatchArray[key].replace(startRegEx, '').replace(endRegEx, ''));
			
			if(!(( valIndexWithoutDelimiter <= startIndex  && startIndex<= (valIndexWithoutDelimiter + lenWithoutDelimiter - 1))&&(valIndexWithoutDelimiter <= endIndex && endIndex <= (valIndexWithoutDelimiter + lenWithoutDelimiter - 1)))){

				if( valIndex <= startIndex  && startIndex<= (valIndex + len - 1)){
					deleteStart = valIndex
				}

				if(valIndex <= endIndex && endIndex <= (valIndex + len - 1)) {
					deleteEnd = (valIndex + len);
				}
			}
		}

		var endStr = val.slice(0,deleteStart) + val.slice(deleteEnd,val.length);
		return ({
			newValue:endStr,
			cursorPosition:deleteStart
		})
	}

	var parse = function(val){
		var html = val;
		var regExp = new RegExp(this.options.startLimit+'(.*?)'+this.options.endLimit,'g')
		var parsedMatchArray = val.match(regExp);
		if(parsedMatchArray){
			var self = this;
			parsedMatchArray.map(function(str){
				var newStr = str.replace(self.options.startLimit, '<span>').replace(self.options.endLimit, '</span>');
				val = val.replace(str, newStr);
			})
		}
		this.div.innerHTML = val;
	}

	this.setCursorPosition = function(pos){
		this.textarea.selectionStart = pos;
		this.textarea.selectionEnd = pos;
	}

	this.insertValueAt = function(text){
		var originalText = this.textarea.value;
		var end = this.textarea.selectionEnd;
		var resultText = originalText.slice(0,end)+ text + originalText.slice(end);
		this.textarea.value = resultText;
	}

	this.setValue = function(text){
		this.textarea.value = text;
	}
}

module.exports = SmartTagsInput;