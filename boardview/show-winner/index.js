
import { LitElement, css, html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

export default class ShowWinner extends LitElement {

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

    .token {
      border: 1px dashed black;
      border-radius: 2px;
      background-color: #fc0;
      color: black;
    }
  `;

  static properties = {
    winner: { type: String },
    tokens: { type: Object },
  };

  dialogRef = createRef();

  constructor() {
    super()
  }

  open(winner, tokens) {
    this.winner = winner
    this.tokens = tokens;
    this.dialogRef.value.showModal()
  }

  close() {
    this.dialogRef.value.close()
  }

  render() {
    // <h1>${this.winner} is the winner!</h1>
    return html`
      <dialog ${ref(this.dialogRef)} class="modal-body">
        <h1>Someone is the winner!</h1>
        <h2>Check the color of the top token</h2>
        <h3>You played so well, Jesus came back for you!</h3>
        <h2>Token Amounts:</h2>
        ${
          this.tokens
            ? Object.entries(this.tokens).map(([name, amount], i) =>
              html`<h3><span class="name${i}">${name}</span> : <span class="token">${amount}</span></h3>`
            )
            : ''
        }
      </dialog>
    `;
  }
}

customElements.define('show-winner', ShowWinner);
