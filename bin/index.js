var SmartTagsInput = function (obj){

	this.obj = obj;

	this.innerWrapper = null;

	this.inputElem = null;

	this.div = null;

	this.options = {
		startLimit : '{{',
		endLimit : '}}',
		isInputTag :true,
		inputType : 'text',
		onChange : function(e){
		},
		onFocus : function(e){
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

			var inputElem = document.createElement('textarea');
			if(this.options.isInputTag){
				inputElem = document.createElement('input');
				inputElem.type = this.options.inputType;
			}
			inputElem.className = "tags-input-textarea tags-input";
			inputElem.value = this.options.value;
			inputElem.autofocus = true;
			this.inputElem = inputElem;


			var div = document.createElement('div');
			div.className = "tags-input-div tags-input";
			this.div = div;

			innerWrapper.appendChild(this.inputElem);
			innerWrapper.appendChild(div);
			addListners.call(this);

		}

	}

	var optionsMerge = function(options){
		for (key in this.options) {
			this.options[key] = options[key] === false ?false : (options[key]|| this.options[key])
		}
	}

	var addListners = function(){
		this.inputElem.addEventListener('blur', onTextAreaBlur.bind(this));
		this.inputElem.addEventListener('input', this.options.onChange);
		this.inputElem.addEventListener('focus', onTextAreaFocus.bind(this));
		this.inputElem.addEventListener('keydown', onKeyDown.bind(this));
		this.inputElem.addEventListener('keyup', onKeyUp.bind(this));
	}

	var onTextAreaFocus = function(e){
		this.div.style.opacity = '0';
		this.inputElem.style.opacity = '1';
		this.options.onFocus(e);
	}

	var onTextAreaBlur = function(e){
		parse.call(this,e.currentTarget.value);
		e.currentTarget.style.opacity = '0';
		this.div.style.opacity = '1';
	}

	var onKeyDown = function(e){
		if (e.keyCode === 8 || e.keyCode === 46) {
			var val = this.inputElem.value;
			var end = this.inputElem.selectionEnd;
			var start = this.inputElem.selectionStart;

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

				this.inputElem.value = output.newValue;
				this.setCursorPosition(output.cursorPosition);
			}

		}
		
	}

	var onKeyUp = function(e){
		TextareaHeightHandler.call(this);
	}

	var TextareaHeightHandler = function(){
		var editableArea = this.inputElem;
			editableArea.style.height = 'auto';
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
		this.inputElem.selectionStart = pos;
		this.inputElem.selectionEnd = pos;
	}

	this.insertValueAt = function(text){
		var originalText = this.inputElem.value;
		var end = this.inputElem.selectionEnd;
		var resultText = originalText.slice(0,end)+ text + originalText.slice(end);
		this.inputElem.value = resultText;
	}

	this.setValue = function(text){
		this.inputElem.value = text;
	}
}

module.exports = SmartTagsInput;