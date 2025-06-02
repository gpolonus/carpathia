
const redCards = require('./redCards.json');
let redCardsHolder = redCards

module.exports = {
  getCard: () => {
    const cardIndex = Math.round(Math.random() * (redCards.length - 1))
    const card = redCardsHolder.splice(cardIndex, 1)[0]
    if(redCardsHolder.length === 0) {
      redCardsHolder = redCards
    }
    return card
  }
}
