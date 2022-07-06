const duplicate_currencies = require('./duplicate_currencies.json')

const filterCoins = (coins = [], removeSLcoins = true) => {
  var terms = ['3S', '3L', '5S', '5L']

  // const url = "https://api.coingecko.com/api/v3/coins/list";
  var newCoins = []
  coins.map((__coin, _key) => {
    var found = 0

    for (var i = 0; i < duplicate_currencies.length; i++) {
      if (
        duplicate_currencies[i].symbol.toUpperCase() ==
        __coin.pair.split('/')[0]
      ) {
        found = 0
        break
      } else {
        const isSLcoin = terms.some((term) =>
          __coin.pair.split('/')[0].includes(term),
        )
        if (removeSLcoins) {
          if (!isSLcoin) found = 1
        } else {
          found = 1
        }
      }
    }

    if (found == 1) {
      newCoins.push(__coin)
    }
  })
  // console.log('>>', newCoins)
  // console.log(newCoins, 'DONE', newCoins.length)
  return newCoins
}

module.exports = filterCoins
