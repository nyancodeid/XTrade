const _ = require('lodash')
const uriQuery = require('http-build-query')
const hmacSHA512 = require('crypto-js/hmac-sha512')
const axios = require('axios')
const random = require('randomstring')

const ErrorProvider = require('./errors')

let Indodax = {
    toPair(objectPair) {
        if (_.isArray(objectPair)) {
            return objectPair.join('_')
        } else {
            throw new Error(ErrorProvider.ERRPAIR.message);
        }
    },
    toTicker(pair) {
        return process.env.URI_API + pair + "/ticker"
    },
    isPairIDR(pair) {
        if (_.isArray(pair)) {

            return (pair[1].toLowerCase() === "btc") ? true : false
        }
    },
    isPairBTC(pair) {
        if (_.isArray(pair)) {

            return (pair[1].toLowerCase() === "idr") ? true : false
        }
    },
    makeSign(datas) {
        if (_.isObject(datas)) {
            let data = uriQuery(datas)
            
            return hmacSHA512(data, process.env.IDX_KEY).toString()
        }
    },
    execRequest(req) {
        req.nonce = Date.now()

        return axios({
            url: process.env.URI_TAPI,
            method: 'POST',
            headers: {
                Key: process.env.IDX_API,
                Sign: Indodax.makeSign(req)
            },
            data: uriQuery(req)
        })
    }
}
let Action = function() {
    
}

/**
 * @description get account balance every currency
 * 
 * @returns { Object }
 */
Action.prototype.balance = function() {

    return Indodax.execRequest({
        method: "getInfo"
    }).then(res => {
        if (res.status === 200) {
            if (res.data.success) {
                
                return res.data.return.balance
            }
        }
    })
}

/**
 * @description get trading history by Pair
 * @param pair { Array }
 * 
 * @returns { Object }
 */
Action.prototype.tradeHistory = function(config) {
    let pair = undefined

    try {
        pair = Indodax.toPair(config.pair)
    } catch (error) {
        
        return Promise.reject(ErrorProvider.ERRPAIR)
    }

    return Indodax.execRequest({
        method: "tradeHistory",
        pair: pair,
        count: config.count,
        from_id: config.from,
        end_id: config.end,
        order: config.orderBy,
        since: (_.isUndefined(config.date)) ? undefined : config.date.since,
        end: (_.isUndefined(config.date)) ? undefined : config.date.end,
    }).then(res => {
        if (res.status === 200) {
            if (res.data.success) {

                return res.data.return
            }
        }
    })
}
/**
 * @description get trading open orders if with pair is return Array
 * @param pair { Array }
 * 
 * @returns { Object }
 */
Action.prototype.openOrders = function(pair) {
    let req = {
        method: 'openOrders'
    }

    if (!_.isUndefined(pair)) {
        req.pair = Indodax.toPair(pair)
    }
    
    return Indodax.execRequest(req).then(res => {
        if (res.status === 200) {
            if (res.data.success) {

                return res.data.return.orders
            } 
        }
    })
}


/**
 * @description get ticker for pair
 * @param pair { Array }
 * 
 * @returns { Object }
 */
Action.prototype.get = function (pair) {
    pair = Indodax.toPair(pair)

    return axios.get(Indodax.toTicker(pair)).then(body => {
        if (body.status === 200) {

            return body.data.ticker
        }
    })
}

/**
 * @description do buy trading
 * @param config { Object }
 * 
 * @returns { Object }
 */
Action.prototype.buy = function(config) {
    let pair = Indodax.toPair(config.pair)
    let request = {
        method: 'trade',
        pair: pair,
        type: 'buy',
        price: config.price
    }

    if (Indodax.isPairBTC(config.pair)) {
        request.btc = config.amount
    } else if (Indodax.isPairIDR(config.pair)) {
        request.idr = config.amount
    } else {
        return Promise.reject(ErrorProvider.ERRPAIR)
    }
    
    return Indodax.execRequest(request).then(res => {
        if (res.status === 200) {
            if (res.data.success) {

                return res.data.return
            } else {

                return Promise.reject(ErrorProvider.ERRTRADEBUY(res.data.return))
            }
        }
    })
}
/**
 * @description do sell trading
 * @param config { Object }
 * 
 * @returns { Object }
 */
Action.prototype.sell = function (config) {
    let pair = Indodax.toPair(config.pair)
    let request = {
        method: 'trade',
        pair: pair,
        type: 'sell',
        price: config.price
    }

    if (Indodax.isPairBTC(config.pair)) {
        request.btc = config.amount
    } else if (Indodax.isPairIDR(config.pair)) {
        request.idr = config.amount
    } else {
        return Promise.reject(ErrorProvider.ERRPAIR)
    }

    return Indodax.execRequest(request).then(res => {
        if (res.status === 200) {
            if (res.data.success) {

                return res.data.return
            } else {

                return Promise.reject(ErrorProvider.ERRTRADEBUY(res.data.return))
            }
        }
    })
}

Action.prototype.getOrder = function(config) {
    let pair = undefined

    try {
        pair = Indodax.toPair(config.pair)
    } catch(e) {
        return Promise.reject(ErrorProvider.ERRPAIR)
    }

    return Indodax.execRequest({
        method: 'getOrder',
        pair: pair,
        order_id: config.id
    }).then(res => {
        if (res.status === 200) {
            if (res.data.success) {

                return res.data.return.order
            }
        }
    })
}
Action.prototype.cancelOrder = function(config) {
    let pair = undefined

    try {
        pair = Indodax.toPair(config.pair)
    } catch(e) {

        return Promise.reject(ErrorProvider.ERRPAIR)
    }

    return Indodax.execRequest({
        method: 'cancelOrder',
        pair: pair,
        order_id: config.id,
        type: config.type
    }).then(res => {
        if (res.status === 200) {
            if (res.data.success) {

                return res.data.return
            }
        }
    })
}
Indodax.action = new Action()

module.exports = Indodax