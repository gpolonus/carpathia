
import { LitElement, css, html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

export default class BoardviewPlayers extends LitElement {

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
  `;

  static properties = {
    // players: {  },
    // This is a drunk patch bc the oldValue in the Lit internals keeps being
    // wrong and not triggering changes for some reason.
    // TODO LATER: Fix this. Probably just need to make this object correct or add
    // a converter or something.
    players: { hasChanged: () => true }
  };

  dialogRef = createRef();

  constructor() {
    super()

    this.players = []
  }

  open(players) {
    this.players = players || []
    this.dialogRef.value.showModal()
  }

  close() {
    if (!this.players?.length < 2) {
      alert('Cannot start without enough players')
      return
    }

    this.dialogRef.value.close()
    this.dispatchEvent(new CustomEvent('start', { bubbles: false }))
  }

  render() {
    return html`
      <dialog ${ref(this.dialogRef)} class="modal-body">
        <h1>Welcome to Carpathia!</h1>
        <h2>Waiting for players</h2>
        ${this.players.map(p => html`
          <h4 class=${p.color}>${p.name}</h4>
        `)}
        <div>
          <button @click=${this.close}>Start</button>
        </div>
      </dialog>
    `;
  }
}

customElements.define('boardview-players', BoardviewPlayers);
