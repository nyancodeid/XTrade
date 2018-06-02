const async = require('async')
const _ = require('lodash')

const Indodax = require('../service/indodax')
const Logs = require('../service/log')

let PingPong = function(config) {
    Object.assign(this, config)
}

PingPong.prototype.doCheck = function() {
    return Indodax.action.ticker(this.pair).then(ticker => {
        if (Indodax.isPairBTC(this.pair)) {
            if (this.account.balance.btc <= 0) {

                return {
                    account: this.account.balance.idr,
                    is: Indodax.isPairBTC(this.pair),
                    iss: Indodax.isPairIDR(this.pair),
                    pair: this.pair,
                    message: "Not enough balance"
                }
            } else {
                return this.doForBTCPair(ticker)
            }
        } else if (Indodax.isPairIDR(this.pair)) {
            if (this.account.balance.idr <= 0) {

                return {
                    account: this.account.balance,
                    message: "Not enough balance"
                }
            } else {
                return this.doForIDRPair(ticker)
            }
        } else {
            return {
                result: _.sample(['BUY', 'SELL']),
                ticker
            }
        }
    })
}
PingPong.prototype.doForBTCPair = function(_ticker) {

    console.log(this.account.balance)
    console.log(_ticker)

    return {
        result: 'BUY'
    }
}
PingPong.prototype.doForIDRPair = function (_ticker) {

    console.log(this.account.balance)
    console.log(_ticker)
    
    return {
        result: 'BUY'
    }
}

module.exports = PingPong