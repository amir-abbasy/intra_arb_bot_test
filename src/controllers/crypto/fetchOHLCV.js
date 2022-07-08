const ccxt = require('ccxt')


async function fetchOHLCV(req, res) {
  const {
    query: { market, exchange1, exchange2 },
  } = req

  let ex_1 = new ccxt[exchange1]()
  let ex_2 = new ccxt[exchange2]()
  // let data_binance = await binance.fetchTrades(pair || 'ETH/USDT')
  let market1_data = await ex_1.fetchOHLCV(market, '1m', undefined, 1)
  let market2_data = await ex_2.fetchOHLCV(market, '1m', undefined, 1)

  console.log("-------------",  market, exchange1, exchange2);

  // res.status(200).json({name: 'ami'})
  res.status(200).json({ data: { pair1: market1_data, pair2: market2_data } })
}
module.exports =  fetchOHLCV
