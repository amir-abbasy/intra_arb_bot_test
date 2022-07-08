'use strict'
const ccxt = require('ccxt')

const exchanges = require('../exchanges')


async function makeData(callback) {
  const coll = []

  for (let index = 0; index < exchanges.length; index++) {
    const element = exchanges[index]
    const exchange = new ccxt[element]()
    let tickers = []

    // let mrkts = await new ccxt[element]().fetchMarkets()

    if (exchange.has['fetchTickers']) {
      // all tickers indexed by their symbols
      var fetchTickers = await exchange.fetchTickers()

      Object.entries(fetchTickers).map(async (_, k) => {
        if (_[1]['close'] == 0) return
        if (_[1]['symbol'].split('/')[1] != 'USDT') return

        const obj = {
          ex: _[1]['symbol'],
          close: _[1]['close'],
        }
        tickers.push(obj)
        // return obj
      })
      //   console.log(tickers[0].close)
      coll.push({ [element]: tickers })
    } else {
      console.log('no Tickets')
    }
  }

  // console.log(coll[0].binance[0])
  // console.log(coll)

  // return coll
  callback(coll)
}
module.exports = makeData
// var data = await makeData()
