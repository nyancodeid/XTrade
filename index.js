const dotenv = require('dotenv').config()
const async = require('async')

const Action = require('./service/action')
const Indodax = require('./service/indodax')

async.waterfall([
    (callback) => {
        Indodax.action.balance().then(account => {
            Object.keys(account).forEach(pair => {
                account[pair] = (account[pair] * 1)
            })

            callback(null, account)
        })
    },
    (account, callback) => {
        Action.do.PingPong({
            pair: 'STQ/IDR',
            prices: [100, 150],
            amount: 10000,
            percent: 1,
            interval: 1,
            account: {
                balance: account
            },
            beforeBuy(data) {
                console.log(`Before Buy`)
            },
            beforeSell(data) {
                console.log(`Before Sell`)
            },
            onBuy(order) {
                console.log(`On Buy`)
            },
            onSell(order) {
                console.info('on Sell')
            }
        })

        callback(null)
    }
], err => {
    console.info("Bot Running")
})