// const array_ = require('./dataSet.json')

const config = require('./config')

const keys = require('./exchanges')
// var keys = ['binance', 'wazirx']

const markets = (array_) => {
  var output = {}

  array_.forEach(function (item, key) {
    const existing = (val) => {
      var bool = false
      Object.keys(output).filter((v, k) => {
        if (v == val) bool = true
      })

      return bool
    }

    item[keys[key]].map((_, k) => {
      if (existing(_.ex)) {
        output[_.ex] = { ...output[_.ex], [keys[key]]: { close: _.close } }
      } else {
        Object.assign(output, { [_.ex]: { [keys[key]]: { close: _.close } } })
      }
    })
  })

  // console.dir(output)

  // PAHSE 2
  // difference from Config.js

  var diff = config.difference
  var out_final = []

  Object.entries(output).map((_, k) => {
    var low = { low_exchange: '', price: 0 }
    var high = { high_exchange: '', price: 0 }
    var isPairable = Object.entries(_[1]).length > 1

    isPairable &&
      Object.entries(_[1]).map((item, index) => {
        // console.log(item[0], item[1])

        if (low.price > item[1].close) {
          low.price = item[1].close
          low.exchange = item[0]
        }
        if (index == 0) {
          low.price = item[1].close
          low.exchange = item[0]
        }
        if (high.price < item[1].close) {
          high.price = item[1].close
          high.exchange = item[0]
        }
      })
    var ex_diff = high.price - low.price
    var isProfitable = ex_diff > diff

    // minimum_token_price from Config.js
    var isAffordable = low.price < config.minimum_token_price

    // isAffordable &&
    //   isPairable &&
    //   isProfitable &&
    //   console.log('\n', _[0], '------------------------')
    // isAffordable && isPairable && isProfitable && console.log(low, high)
    // isAffordable &&
    //   isPairable &&
    //   isProfitable &&
    //   console.log(isProfitable, ex_diff.toFixed(3))

    if (isAffordable && isPairable && isProfitable) {
      out_final.push({ pair: _[0], low, high, diff: ex_diff.toFixed(3) })
    }
  })

  // console.log(output);
  // return out_final
  return out_final
}

module.exports = markets
