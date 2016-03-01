(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.SmartTagsInput = require('./index.js')
},{"./index.js":2}],2:[function(require,module,exports){
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
							output = validator(parsedMatchArray,val,(start-1),(start-1))	
						}
					}else{
						if(end !== val.length){
							output = validator(parsedMatchArray,val,(end),(end))	
						}
					}
				}else{
					if(start < end){
						output = validator(parsedMatchArray,val,(start),(end-1))
					}else{
						output = validator(parsedMatchArray,val,(end),(start-1))
					}
				}

				this.textarea.value = output.newValue;
				this.setCursorPosition(output.cursorPosition);
			}

		}		
		if (e.keyCode === 13 || e.keyCode === 8 || e.keyCode === 46) {
			this.textarea.style.height = 'auto';
			this.textarea.style.height = this.textarea.scrollHeight+'px';
		}
		TextareaHeightHandler.call(this);
	}

	var TextareaHeightHandler = function(){
		var editableArea = this.textarea;
		editableArea.style.height = 'auto';
		var editableAreaHeight = editableArea.scrollHeight,
			style = window.getComputedStyle(editableArea),
    		top = style.getPropertyValue('padding-top'),
    		paddingTop = top.substr(0, top.length-2),
    		bottom = style.getPropertyValue('padding-bottom'),
    		paddingBottom = bottom.substr(0, bottom.length-2);
		var finalHeight = editableAreaHeight - paddingTop - paddingBottom;
		editableArea.style.height = finalHeight+"px";
	}

	var validator = function(parsedMatchArray,val,startIndex,endIndex){
		var deleteStart = startIndex,
			deleteEnd = endIndex +1;
		for (key in parsedMatchArray) {
			var len = parsedMatchArray[key].length;
			var valIndex = val.indexOf(parsedMatchArray[key]);
			if( valIndex <= startIndex  && startIndex<= (valIndex + len - 1)){
				deleteStart = valIndex
			}

			if(valIndex <= endIndex && endIndex <= (valIndex + len - 1)) {
				deleteEnd = (valIndex + len);
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
},{}]},{},[1]);
