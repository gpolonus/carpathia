
import { LitElement, css, html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

export default class RedCard extends LitElement {

  static styles = css`
    dialog {
      padding: 2rem;
      max-height: calc(100vh - 210px);
      overflow-y: auto;
    }

    dialog.modal-body {
      max-height: calc(100vh - 210px);
      overflow-y: auto;
    }

    dialog::backdrop {
      background-color: rgb(150,50,50, 0.8);
    }

    dialog h1 {
      text-transform: capitalize;
    }

    dialog.error {
      border-color: red;
      background-color: lightcoral;
    }

    dialog.colors div.fields {
      text-align: left;
      --text-color: black;
    }

    dialog.colors div.field {
      padding: 1rem;
    }

    .truthing {
      color: green;
    }

    .lying {
      color: red;
    }
  `;

  static properties = {
    // players: {  },
    // This is a drunk patch bc the oldValue in the Lit internals keeps being
    // wrong and not triggering changes for some reason.
    // TODO: Fix this. Probably just need to make this object correct or add
    // a converter or something.
    prompt: { type: String },
    message: { type: String },
    result: { type: String }
  };

  dialogRef = createRef();

  constructor() {
    super()
  }

  open(prompt, message, result) {
    this.prompt = prompt
    this.message = message;
    this.result = result
    this.dialogRef.value.showModal()
  }

  close() {
    this.dialogRef.value.close()
  }

  render() {
    return html`
      <dialog ${ref(this.dialogRef)} class="modal-body">
        <h1>Red Card Prompt:</h1>
        <h2>${this.prompt}</h2>
        ${
          !!this.message
            ? html`<h3>${this.message}</h3>`
            : ''
        }
        ${!!this.result
          ? html`<h2 class="${this.result?.toLowerCase()}">
              ${this.result}
            </h2>`
          : ''
        }
      </dialog>
    `;
  }
}

customElements.define('red-card', RedCard);
