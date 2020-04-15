// https://github.com/open-wc/lit-demos/blob/master/01-basic/11-fetching-data.js

import { LitElement, html } from 'lit-element';

class FetchingData extends LitElement {
  static get properties() {
    return {
      response: { type: Array }
    }
  }

  constructor() {
    super();
    this.response = [];
  }

  firstUpdated() {
    fetch('https://quotes.rest/qod/')
      .then((r) => r.json())
      .then((r) => {
        this.response = r.contents.quotes;
      });
  }

  render() {
    const { response } = this;
    return html`
        <ul>
          ${response.map(item => html`
            <li>${item.quote} - ${item.author}</li>
          `)}
        </ul>
      `;
  }
}

customElements.define('fetching-data', FetchingData);
