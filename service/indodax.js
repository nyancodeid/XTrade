const _ = require('lodash')
const uriQuery = require('http-build-query')
const hmacSHA512 = require('crypto-js/hmac-sha512')
const axios = require('axios')

let Indodax = {
    toPair(objectPair) {
        if (_.isArray(objectPair)) {
            return objectPair.join('_')
        }
    },
    toTicker(pair) {
        return process.env.URI_API + pair + "/ticker"
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
 * @description get ticker for pair
 */
Action.prototype.get = function (pair) {
    pair = Indodax.toPair(pair)

    return axios.get(Indodax.toTicker(pair)).then(body => {
        if (body.status === 200) {
            
            return body.data.ticker
        }
    })
}
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
Action.prototype.tradeHistory = function(pair) {
    pair = Indodax.toPair(pair)

    return Indodax.execRequest({
        method: "tradeHistory",
        pair: pair
    }).then(res => {
        if (res.status === 200) {
            if (res.data.success) {

                return res.data.return
            }
        }
    })
}
Action.prototype.buy = function() {
    
}
Action.prototype.sell = function () {

}

Indodax.action = new Action()

module.exports = Indodax