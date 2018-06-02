'use strict';
const ccxt = require('ccxt');
const dotenv = require('dotenv').config();

const PERCENT = 1;
const MINIMUM_IDR = 150000;

(async function () {
    let Indodax = new ccxt.indodax({
        apiKey: process.env.IDX_API,
        secret: process.env.IDX_KEY
    })

    let _balance = await Indodax.fetchBalance()
    let _ticker = await Indodax.fetchTicker('STQ/IDR')

    let _buy = Math.round(_ticker.info.sell - (PERCENT / 100 * _ticker.info.sell))
    let _sell = Math.round(_buy + (PERCENT / 100 * _buy))

    if (_balance.STQ.free >= 1000) {
        console.log(await Indodax.createLimitSellOrder('STQ/IDR', 1100, _sell))
    } else if (_balance.info.balance.idr >= MINIMUM_IDR) {
        console.log(await Indodax.createLimitBuyOrder('STQ/IDR', 1100, _buy))
    }
})();