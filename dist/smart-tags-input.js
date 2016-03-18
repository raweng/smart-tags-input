(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.SmartTagsInput = require('./index.js')
},{"./index.js":2}],2:[function(require,module,exports){
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
			}else{
				innerWrapper.className = "tags-input-wrapper tags-textarea-wrapper";
			}
			inputElem.className = "tags-input-textbox tags-input";
			inputElem.value = this.options.value;
			inputElem.autofocus = true;
			this.inputElem = inputElem;

			innerWrapper.appendChild(this.inputElem);

			if (!this.options.isInputTag || (this.options.isInputTag && this.options.inputType === 'text')) {
				var div = document.createElement('div');
				div.className = "tags-input-div tags-input";
				this.div = div;
				innerWrapper.appendChild(div);
			}

			TextareaHeightHandler.call(this);
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
		if(this.div){			
			this.div.style.opacity = '0';
			this.inputElem.style.opacity = '1';
		}
		this.options.onFocus(e);
	}

	var onTextAreaBlur = function(e){
		if(this.div){			
			parse.call(this,e.currentTarget.value);
			e.currentTarget.style.opacity = '0';
			this.div.style.opacity = '1';
		}
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
				trigger(this.inputElem,'input');
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
			pos = 0,
			startRegEx = new RegExp('^'+this.options.startLimit),
			endRegEx = new RegExp(this.options.endLimit+'$');
		for (key in parsedMatchArray) {

			var len = parsedMatchArray[key].length;
			var valIndex = val.indexOf(parsedMatchArray[key],pos);
			
			var lenWithoutDelimiter = parsedMatchArray[key].replace(startRegEx, '').replace(endRegEx, '').length;
			var valIndexWithoutDelimiter = val.indexOf(parsedMatchArray[key].replace(startRegEx, '').replace(endRegEx, ''),pos);
			
			pos = valIndex + len;

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

	var trigger = function(element,event){
		if ("createEvent" in document) {
		    var evt = document.createEvent("HTMLEvents");
		    evt.initEvent(event, false, true);
		    element.dispatchEvent(evt);
		}
		else
		    element.fireEvent(event);
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
		if(this.div){
			parse.call(this,resultText);
		}
		trigger(this.inputElem,'input');
	}

	this.setValue = function(text){
		this.inputElem.value = text;
		if(this.div){
			parse.call(this,text);
		}
		TextareaHeightHandler.call(this);
	}
}

module.exports = SmartTagsInput;
},{}]},{},[1]);
