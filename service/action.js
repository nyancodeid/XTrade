const _ = require('lodash')
const randomstring = require('randomstring')

const Trade = require('./trade')

let Tradings = {
    PingPong(config) {
        config.id = randomstring.generate(16)
        config.strategy = "pingpong"

        new Trade(config)
    }
}

let Actions = {
    do: Tradings
}

module.exports = Actions