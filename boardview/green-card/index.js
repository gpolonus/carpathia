
import { LitElement, css, html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

export default class GreenCard extends LitElement {

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

    .correct {
      color: green;
    }

    .wrong {
      color: red;
    }
  `;

  static properties = {
    card: { type: Object },
    answer: { type: String },
    correctAnswer: { type: String }
  };

  dialogRef = createRef();

  constructor() {
    super()

    this.players = []
  }

  open(card, answer, correctAnswer) {
    this.card = card || {}
    this.answer = answer;
    this.correctAnswer = correctAnswer
    this.dialogRef.value.showModal()
  }

  close() {
    this.dialogRef.value.close()
  }

  render() {
    const optionPrefixes = ['A', 'B', 'C', 'D',]
    const card = this.card || {}
    const isCorrect = this.correctAnswer == this.answer
    const correctIndex = this.correctAnswer ? this.correctAnswer - 1 : -1
    const wrongIndex = this.answer ? this.answer - 1 : -1
    return html`
      <dialog ${ref(this.dialogRef)} class="modal-body">
        <h1>Question:</h1>
        <h2>${card.question}</h2>
        ${card.options?.map((o, i) => html`
          <h4 class="${[
            correctIndex === i ? 'correct' : '', !isCorrect && wrongIndex === i ? 'wrong' : ''
          ].join(' ')}">
            ${optionPrefixes[i]}: ${o}
          </h4>
        `)}
        ${correctIndex !== -1
          ? html`<h3 class="${isCorrect ? 'correct' : 'wrong'}">
              ${isCorrect ? 'CORRECT' : 'WRONG'}
            </h3>`
          : ''
        }
      </dialog>
    `;
  }
}

customElements.define('green-card', GreenCard);
