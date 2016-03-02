# Smart Tags Input

‘Smart Tags Input’ is a JavaScript plugin that allows you to easily turn any text input (entered within double curly braces) into ‘smart tags’. This helps you differentiate normal text from the text that you want to highlight. 

## Features 

**Quick delete**: Once normal text is converted to smart tags, you can delete the entire tag with one press of ‘Backspace’ or ‘Delete’ keys. 

**Edit text**: Clicking on this smart tag makes it editable, unlike most tags. You can then edit the text present within the curly braces, and convert it back to smart tags instantly. 

**Choice of brackets**: We can change the type of bracket by changing the options provided in init(*options*) startLimit and endLimit. 
## Motivation
Our in-house product, Built.io Flow, is an iPaaS platform that integrates various external services. This integration is done by passing data from one activity to another. However, when data of one activity was inserted into the fields of another activity, it was always enclosed within double curly braces. The Built.io Flow team wanted to differentiate this data from normal text by highlighting or tagging the data. After an extensive search on the Web, we found that there are no plugins available that converts data within double curly braces into smart tags. Consequently, we started with creating our own plugin.  

## Installation

Add script tag with the plugin file in our html <head> tag

```html
<script src="dist/smart-tags-input.js"></script>
```

We need to initialize the plugin in the local JavaScript file.

```js
document.addEventListener('DOMContentLoaded', function(){
	var tagInput = new SmartTagsInput("*ID_or_element*");
	tagInput.init(*options*);
}, false);
```

## API Reference

This plugin is based on instances created from SmartTagsInput class. The constructor accepts an element's id or its DOM element itself.
```js
	var tagInputInstance = new SmartTagsInput("*ID_or_element*");
	tagInputInstance.init(*options*);
```	
To initialize the plugin you can use init(*options*) function. It accepts an object as parameter for providing options.
### Options

	 options 	| description 
	 :-----------: 	| :---------: 
	 startLimit 	| The starting enclosing character
	 endLimit 	| The ending enclosing character
	 onChange	| A callback function providing the change event of the textarea
	 value		| Initial value
	 
### Methods
	
	methods 	| parameters | description 
	 :-----------: 	| :---------:| :---------: 
	 setCursorPosition | position (*integer*) | Sets the cursor position
	 insertValueAt 	| text (*string*) | Sets the text at current cursor position
	 setValue 	| text (*string*) | Sets the text in the textarea

eg:
```js
	tagInputInstance.setValue('this is a text to be set in textarea');
```

## Development

### Install dependencies:
```js
	npm install
	gulp install
```
### Test:
```js
	gulp serve
```
### Build:
```js
	gulp build
```

## License

The MIT License (MIT)
Copyright (c) 2016 Built.io 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
