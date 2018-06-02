const dotenv = require('dotenv').config()
const Indodax = require('./service/indodax')


function name(config) {
    let id = setInterval(() => {
        console.log('i am from interval ' + config)
    }, 10000)

    return id
}

let names = name('Ryan')

console.log({
    id: names
})