
const redCards = require('./redCards.json');

module.exports = {
  getCard: () => redCards[Math.round(Math.random() * (redCards.length - 1))]
}
