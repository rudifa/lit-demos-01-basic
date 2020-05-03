// https://github.com/open-wc/lit-demos/blob/master/01-basic/12-firing-events.js

import { LitElement, html, css, svg } from 'lit-element';

class FireEventsParent extends LitElement {
  static get properties() {
    return {
      _messageFromChild: { type: String },
      _messageForSibling: { type: String },
    }
  }
  constructor() {
    super()
    this._messageFromChild = "..."
    this._messageForSibling = "Are you listening?"
  }

  someCallback(event) {
    //console.log(event.detail);
    this._messageFromChild = event.detail
    this._messageForSibling = event.detail
  }

  sliderCallback(event) {
    this._messageFromChild = event.detail  
  }

  render() {
    return html`
      <fire-events-child @event-fired=${this.someCallback}></fire-events-child>
      <p>${this._messageFromChild}</p>
      <fire-events-sibling message=${this._messageForSibling}></fire-events-sibling>
      <fire-events-slider @event-slider=${this.sliderCallback}></fire-events-slider>
    `;
  }
}

class FireEventsChild extends LitElement {
  static get properties() {
    return {
      _messageCount: { type: Number },
    }
  }
  constructor() {
    super()
    this._messageCount = 0
  }

  handleClick() {
    this._messageCount++
    this.dispatchEvent(new CustomEvent('event-fired', { detail: `custom event ${this._messageCount} fired in child` }));
  }

  render() {
    return html`<button @click=${this.handleClick}>clickity</button>`;
  }
}

// Utility functions
function clamp( val, min, max) {
  return val <= min ? min : val >= max ? max : val;
}

function toRadians(degrees) {
  return degrees * Math.PI / 180
}

function displacement(pt1, pt2) {
  return {x: pt2.x - pt1.x, y: pt2.y - pt1.y}
}

function projection(pt, angledeg) {
  let a = toRadians(angledeg)
  return pt.x * Math.cos(a) + pt.y * Math.sin(a)
}          


class FireEventsSibling extends LitElement {
  static get properties() {
    return {
      message: { type: String },
    }
  }
  constructor() {
    super()
    this.message = "I am all ears"
  }

  render() {
    return html`
      <p>${this.message}</p>
    `;
  }
}

class FireEventsSlider extends LitElement {
  static get properties() {
    return {
      _circle_pos: { type: Number },
    }
  }

  constructor() {
    super()
    this._drag_offset = undefined
    this._circle_pos = 0.75  // 0.0...1.0
  }
  
  get value() { return this._circle_pos; }  
  set value(val) {
    let oldVal = this._circle_pos;
    this._circle_pos = clamp(val, 0.0, 1.0);
    this.requestUpdate('value', oldVal);
  }

  _getPosition(evt) {
    let svg = evt.currentTarget
    let CTM = svg.getScreenCTM();
    let pt = svg.createSVGPoint();
    if (evt.touches) {
      pt.x = evt.touches[0].clientX; pt.y = evt.touches[0].clientY;
    } else {
      pt.x = evt.clientX; pt.y = evt.clientY;
    }    
    pt = pt.matrixTransform(CTM.inverse());
    //console.log('_getPosition', evt.target.id, 'svg', svg, 'CTM', CTM, 'pt', pt) 
    return pt
  }

  _dragStart(evt) {
    if (evt.target.id == 'thumb') {
      this._drag_offset = this._getPosition(evt)
      //console.log('_dragStart', evt.target.id, 'mousePos', this.drag_) 
    }
  }

  _dragMove(evt) {
    if (this._drag_offset && evt.target.id == 'thumb') {
      let pos = this._getPosition(evt)
      //console.log('_dragMove', evt.target.id, pos) 
      let displ = displacement(this._drag_offset, pos)
      let proj = projection(displ, 0)
      this._drag_offset = pos
      const rect_length = 100.0
      let new_circlePos = this._circle_pos + proj / rect_length
      this.value = new_circlePos
      //console.log('_dragMove', evt.target.id, this.value)
      this.dispatchEvent(new CustomEvent('event-slider', { detail: `slider value ${this.value.toFixed(2)}`}));
    }
  }

  _dragEnd(event) {
    //console.log('_dragEnd', event)
    this._drag_offset = undefined
  }

  render() {
    return svg`<svg width='110' height='20' viewBox='0 0 110 20'
      @mousedown="${this._dragStart}"
      @mousemove="${this._dragMove}"
      @mouseup="${this._dragEnd}"
      @mouseleave="${this._dragEnd}"
      @touchstart="${this._dragStart}"
      @touchmove="${this._dragMove}"
      @touchend="${this._dragEnd}"
      @touchleave="${this._dragEnd}"
      @touchcancel="${this._dragEnd}"
    >
      <g transform='translate(5,5)'>
        <rect x='0' y='0' width='100' height='10' fill='gray'/>
        <circle id='thumb' cx='${this._circle_pos * 100}' cy='5' r='5' fill='white'
          />
      </g>
    </svg>`;
  }
}


customElements.define('fire-events-parent', FireEventsParent);
customElements.define('fire-events-child', FireEventsChild);
customElements.define('fire-events-sibling', FireEventsSibling);
customElements.define('fire-events-slider', FireEventsSlider);
