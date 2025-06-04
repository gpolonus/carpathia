
import redCards from './redCards.json' with { type: "json" };
let redCardsHolder = redCards

export default {
  getCard: () => {
    const cardIndex = Math.round(Math.random() * (redCards.length - 1))
    const card = redCardsHolder.splice(cardIndex, 1)[0]
    if(redCardsHolder.length === 0) {
      redCardsHolder = redCards
    }
    return card
  }
}
