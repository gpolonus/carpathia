
import OGredCards from './redCards.json' with { type: "json" };

let realRedCards = OGredCards
let redCardsHolder = [...realRedCards]

export default {
  getCard: () => {
    const cardIndex = Math.round(Math.random() * (redCardsHolder.length - 1))
    const card = redCardsHolder.splice(cardIndex, 1)[0]
    if(redCardsHolder.length === 0) {
      redCardsHolder = realRedCards
    }
    return card
  },

  setCards(cards) {
    realRedCards = cards
    redCardsHolder = [...realRedCards]
  }
}
