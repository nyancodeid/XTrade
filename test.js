const expect = require('chai').expect;
const dotenv = require('dotenv').config()

const Action = require('./service/action')
const Indodax = require('./service/indodax')

describe('Indodax', function() {
    describe('Read', function () {
        it('balance: should return object', function(done) {
            Indodax.action.balance().then(res => {
                expect(typeof res, "object")

                done()
            })
        })
        it('get: should return object', function(done) {
            Indodax.action.get(['doge', 'btc']).then(res => {
                expect(typeof res, "object")

                done()
            })
        })
        it('get: should return error', function (done) {
            try {
                Indodax.action.get({}).then(res => {
                    
                    done()
                })
            } catch(e) {
                expect(e.toString().includes('Invalid Pair'), true)

                done()
            }
        })
    })
    describe('Trading', function () {
        it('tradeHistory: should return object', function (done) {
            Indodax.action.tradeHistory(['doge', 'btc']).then(res => {
                expect(typeof res, "object")

                done()
            })
        })
        it('openOrders: should return array', function (done) {
            Indodax.action.openOrders(['doge', 'btc']).then(res => {
                expect(typeof res, "array")

                done()
            })
        })
    })
})