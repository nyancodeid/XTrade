// TODO: 
// Start-Stop Bot Jika Harga 
// Start-Stop Bot jika hari atau waktu yang di tentukan

// Cek StopLose 
// Cek Minimum Price
// Cek Maximum Price

// Max Profit By Percent
// Max Profit By IDR/BTC

// Cold Balance
const async = require('async')
const _ = require('lodash')
const signale = require('signale')

async function _startupTradingChecker() {
    await _checkingPrice()
    await _checkingDateTime()
    
}
async function _startTradingChecker() {
    
}
async function _stopTradingChecker() {
    
}

function _checkingPrice() {
    
}
function _checkingDateTime() {
    
}
function _checkingStopLose() {
    
}
function _checkingPrice() {
    
}
function _checkingProfit() {
    
}
function _checkingBalance() {
    
}

/**
 * TODO: update percent of orders.json and prices
 */
await function _runTradingSync(config) {

    return setInterval(() => {

    }, config.interval)
}
/**
 * TODO: remove setInterval ID for _runTradingSync
 */
await function _stopTradingSync(config) {

    clearInterval(config)
}

function _tradePercentChange() {

}
function _tradePriceChange() {
    
}

module.exports = {
    startup: _startupTradingChecker,
    start: _runTradingSync,
    stop: _stopTradingSync
}