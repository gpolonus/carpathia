
import { LitElement, css, html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import './styles.css'

export default class BoardviewDialog extends LitElement {

  static properties = {
    type: String,
    message: String,
    actionName: String,
    action: Function,
    showCloseButton: Boolean
  };

  dialogRef = createRef();

  constructor() {
    super()

    this.type = ''
    this.message = ''
    this.actionName = ''
    this.action = () => {}
    this.showCloseButton = true
  }

  open({ type = '', message = '', actionName = '', action = () => {}, showCloseButton = true }) {
    this.type = type
    this.message = message
    this.actionName = actionName
    this.action = action
    this.showCloseButton = showCloseButton

    this.dialogRef.value.showModal()
  }

  close() {
    this.type = ''
    this.message = ''
    this.actionName = ''
    this.action = () => {}
    this.showCloseButton = true

    this.dialogRef.value.close()
  }

  render() {
    return html`
      <dialog ${ref(this.dialogRef)} class=${this.type}>
        <h1>${this.message}</h1>
        ${
          this.actionName && this.action
          ? html`<div>
              <button @click=${this.action}>${this.actionName}</button>
            </div>`
          : ''
        }
        ${
          this.showCloseButton
          ? html`<div>
              <button @click=${this.close}>Close</button>
            </div>`
          : ''
        }
      </dialog>
    `;
  }
}

customElements.define('boardview-dialog', BoardviewDialog);
