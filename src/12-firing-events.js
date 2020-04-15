// https://github.com/open-wc/lit-demos/blob/master/01-basic/12-firing-events.js

import { LitElement, html, css } from 'lit-element';

class FireEventsParent extends LitElement {
  static get properties() {
    return {
      _messageFromChild: { type: String },
    }
  }
  constructor() {
    super()
    this._messageFromChild = ""
  }

  someCallback(event) {
    //console.log(event.detail);
    this._messageFromChild = event.detail
  }

  render() {
    return html`
      <fire-events-child @event-fired=${this.someCallback}></fire-events-child>
      <p>${this._messageFromChild}</p>
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

customElements.define('fire-events-parent', FireEventsParent);
customElements.define('fire-events-child', FireEventsChild);
