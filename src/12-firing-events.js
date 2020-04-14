// https://github.com/open-wc/lit-demos/blob/master/01-basic/12-firing-events.js

import { LitElement, html, css } from 'lit-element';

class FireEventsParent extends LitElement {
  someCallback(event) {
    console.log(event.detail);
  }

  render() {
    return html`
      <fire-events-child @event-fired=${this.someCallback}></fire-events-child>
    `;
  }
}

class FireEventsChild extends LitElement {
  handleClick() {
    this.dispatchEvent(new CustomEvent('event-fired', { detail: "custom event fired in child" }));
  }

  render() {
    return html`<button @click=${this.handleClick}>clickity</button>`;
  }
}

customElements.define('fire-events-parent', FireEventsParent);
customElements.define('fire-events-child', FireEventsChild);
