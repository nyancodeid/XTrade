const dotenv = require('dotenv').config()

const Action = require('./service/action')
const Indodax = require('./service/indodax')

Indodax.action.openOrders(['doge', 'btc']).then(res => {
    console.log(res)
}).catch(console.error)