![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Color Tool

Color Tool for changing color text-fragments for the [Editor.js](https://editorjs.io).

![](assets/example.gif)

Include module at your application

```javascript
const Color = require('@stephensaw/color');
```

Require this script on a page with Editor.js.

```html
<script src="..."></script>
```

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    Color: {
      class: Color
    }
  },

  ...
});
```

## Config Params

### colors

Default palettes to include in the actions for quick select.

```
Color: {
  class: Color,
  colors: ['#34344A', '#80475E', '#CC5A71', '#C89B7B', '#F0F757']
}
```

## Output data

Colored text will be wrapped with a `span` tag with an `editorjs-color` class.

```json
{
    "type" : "text",
    "data" : {
        "text" : "Create a directory for your module, enter it and run <span class=\"editorjs-color\" style=\"color: rgb(255, 255, 255)\">npm init</span> command."
    }
}
```

