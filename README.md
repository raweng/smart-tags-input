# Smart Tags Input Plugin

‘Smart Tags Input’ is a JavaScript plugin that allows you to easily turn any text input (entered within double curly braces) into ‘smart tags’. This helps you differentiate normal text from the text that you want to highlight. 

## Features 

**Quick delete**: Once normal text is converted to smart tags, you can delete the entire tag with one press of ‘Backspace’ or ‘Delete’ keys. 

**Edit text**: Clicking on this smart tag makes it editable, unlike most tags. You can then edit the text present within the curly braces, and convert it back to smart tags instantly. 

**Choice of brackets**: We can change the type of bracket by changing the options provided in init(*options*) startLimit and endLimit. 

## Installation

Add script tag with the plugin file in our html <head> tag

```html
<script src="js/smart-tags-input.js"></script>
```

We need to initialize the plugin in the local JavaScript file.

```js
document.addEventListener('DOMContentLoaded', function(){
	var tagInput = new SmartTagsInput("testTagInput");
	tagInput.init();
}, false);
```

## License

The MIT License (MIT)
Copyright (c) 2016 Built.io 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
