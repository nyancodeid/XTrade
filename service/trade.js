const async = require('async')
const _ = require('lodash')

const Indodax = require('../service/indodax')
const Services = require('../service/background_task')
const Logs = require('./log')

const Strategy = {
    _pingpong: require('../strategy/pingpong')
}

let Trade = function (config) {
    Object.assign(this, config)

    this.config = config

    this.doTrade()

    Services.start(config)
}

Trade.prototype.makeDecision = function () {
    if (this.strategy === "pingpong") {
        let service = new Strategy._pingpong(this.config)

        return service.doCheck() 
    }
}
Trade.prototype.prepareAction = function(action) {
    if (action.result === "BUY") {
        if (_.isFunction(this.config.beforeBuy)) {

            this.config.beforeBuy(action.ticker)
        }
    } else if (action.result === "SELL") {
        if (_.isFunction(this.config.beforeSell)) {

            this.config.beforeSell(action.ticker)
        }
    } else {
        console.info('HODL')
    }
}

/**
 * @description Execute all buy and sell prosess
 */
Trade.prototype.doBuy = function() {
    return new Promise((resolve, reject) => {
        Logs.addOrder({
            id: this.pair.join('').toUpperCase() + "q2dqwmls23wb79yzwubqh"
        })

        resolve({
            success: true,
            result: {
                order_id: 1222
            },
            config: {
                
            }
        })
    })
}
Trade.prototype.doSell = function() {
    return new Promise((resolve, reject) => {
        resolve({
            success: true,
            result: {
                order_id: 1333
            }
        })
    })
}

Trade.prototype.doTrade = async function () {
    let action = await this.makeDecision()
    
    this.prepareAction(action)

    console.log(action)

    if (action.result === "BUY") {
        let buy = await this.doBuy()

        if (buy.success) {
            if (_.isFunction(this.config.onBuy)) {
                this.config.onBuy()
            }
        }
    } else if (action.result === "SELL") {
        let sell = await this.doSell()

        if (sell.success) {
            if (_.isFunction(this.config.onSell)) {
                this.config.onSell()
            }
        }
    } else {
        console.info(`Hold ${Indodax.toPair(this.pair)}`)
    }
}

module.exports = Trade