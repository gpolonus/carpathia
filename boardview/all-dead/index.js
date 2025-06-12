
import { LitElement, css, html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

export default class AllDead extends LitElement {

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

  dialogRef = createRef();

  open() {
    this.dialogRef.value.showModal()
  }

  render() {
    return html`
      <dialog ${ref(this.dialogRef)} class="modal-body">
        <h1>CARPATHIA WINS</h1>
        <h1>HE ATE ALL YOUR SOULS</h1>
        <h1>YOU ALL SUCK</h1>
      </dialog>
    `;
  }
}

customElements.define('all-dead', AllDead);
