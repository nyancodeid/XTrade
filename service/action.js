const _ = require('lodash')

const Trade = require('./trade')

let Tradings = {
    PingPong(config) {
        config.strategy = "pingpong"

        new Trade(config)
    }
}

let Actions = {
    do: Tradings
}

module.exports = Actions