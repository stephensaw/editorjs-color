require('./index.css').toString();

class Color {
  static get CSS() {
    return 'editorjs-color';
  }

  static get isInline() {
    return true;
  }

  constructor({data, config, api}) {
    this.api = api;
    this.config = config || {};
    this.data = data;

    this.button = null;

    this.tag = 'SPAN';

    this.actions = document.createElement('div');
    this.container = null;
    this.paletteContainer = null;
    this.palettePreview = null;
    this.colorInput = null;
    this.activeSelection = null;
    this.colorPicker = null;

    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive
    };

    this.buildActions();
  }

  buildActions() {
    const fragment = document.createDocumentFragment();
    const predefinedColors = this.config.colors || [];

    predefinedColors.forEach(color => {
      const palette = document.createElement('div');
      palette.className = 'editorjs-color__palette';
      palette.dataset['color'] = color;
      palette.style.backgroundColor = color;

      fragment.appendChild(palette);
    });

    this.actions.innerHTML = `
      <div class="editorjs-color__container">
        <div class="editorjs-color__palettes">
        </div>
        <div class="editorjs-color__actions">
          <div class="editorjs-color__preview"></div>
          <input type="text" class="editorjs-color__input" />
          <label class="editorjs-color__picker">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"/></svg>
            <input type="color" />
          </label>
        </div>
      </div>
    `;

    this.container = this.actions.querySelector('.editorjs-color__container');
    this.paletteContainer = this.actions.querySelector('.editorjs-color__palettes');
    this.palettePreview = this.actions.querySelector('.editorjs-color__preview');
    this.colorInput = this.actions.querySelector('.editorjs-color__input');
    this.colorPicker = this.actions.querySelector('[type=color]');

    this.actions.querySelector('.editorjs-color__palettes').appendChild(fragment);

    this.paletteContainer.addEventListener('click', (e) => {
      this.selectColor(e.target.dataset['color']);
    });

    this.colorInput.addEventListener('change', (e) => {
      this.selectColor(e.target.value);
    });

    this.colorPicker.addEventListener('change', (e) => {
      this.selectColor(e.target.value);
    });
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = this.toolboxIcon;

    return this.button;
  }

  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag, Color.CSS);

    if (termTag) {
      this.activeSelection = termTag;

      const color = this.RGBToHex(this.activeSelection.style.color);

      this.colorInput.value = color;
      this.palettePreview.style.backgroundColor = color;
    }

    this.checkContainerState();

    this.button.classList.toggle(this.iconClasses.active, !!termTag);
  }

  checkContainerState() {
    this.container.style.display = !!this.activeSelection ? 'flex' : 'none';
  }

  selectColor(colorInput) {
    const color = this.RGBToHex(colorInput);

    this.palettePreview.style.backgroundColor = color;

    if (this.activeSelection) {
      this.activeSelection.style.color = color;
      this.colorPicker.value = color;
      this.colorInput.value = color
    }
  }

  renderActions() {
    return this.actions;
  }

  surround(range) {
    if (!range) {
      return;
    }

    let termWrapper = this.api.selection.findParentTag(this.tag, Color.CSS);

    if (termWrapper) {
      this.unwrap(termWrapper);
      this.activeSelection = null;
    } else {
      this.wrap(range);
      this.activeSelection = termWrapper;
    }

    this.checkContainerState();
  }

  wrap(range) {
    let color = document.createElement(this.tag);

    color.classList.add(Color.CSS);

    color.appendChild(range.extractContents());
    range.insertNode(color);

    this.api.selection.expandToTag(color);
  }

  unwrap(termWrapper) {
    this.api.selection.expandToTag(termWrapper);

    let sel = window.getSelection();
    let range = sel.getRangeAt(0);

    let unwrappedContent = range.extractContents();

    termWrapper.parentNode.removeChild(termWrapper);

    range.insertNode(unwrappedContent);

    sel.removeAllRanges();
    sel.addRange(range);
  }

  get toolboxIcon() {
    return require('./../assets/icon.svg').default;
  }

  RGBToHex(rgb) {
    if (rgb.indexOf('#') > -1 && rgb.indexOf('rgb')) {
      return rgb;
    }

    if (rgb.length === 0) {
      return '';
    }

    let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
    rgb = rgb.substr(4).split(')')[0].split(sep);

    let r = (+rgb[0]).toString(16);
    let g = (+rgb[1]).toString(16);
    let b = (+rgb[2]).toString(16);

    if (r.length === 1) {
      r = '0' + r;
    }

    if (g.length === 1) {
      g = '0' + g;
    }

    if (b.length === 1) {
      b = '0' + b;
    }

    return '#' + r + g + b;
  }

  static get sanitize() {
    return {
      span: {
        class: Color.CSS,
        style: true,
      }
    }
  }
}

module.exports = Color;
