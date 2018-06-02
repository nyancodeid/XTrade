const jsonFile = require('jsonfile')
const path = require('path')

let Log = function() {
    
}

Log.prototype.getOrders = function() {
    return new Promise((resolve, reject) => {
        try {
            let orders = jsonFile.readFileSync(path.join(__dirname + process.env.ORDERS_PATH))

            resolve({
                success: true,
                orders
            })
        } catch(e) {

            reject({
                success: false,
                code: 'ERRORGETFILES',
                e
            })
        }
    })
}

Log.prototype.addOrder = function(order) {
    return new Promise((resolve, reject) => {
        try {
            let orders = jsonFile.readFileSync(path.join(__dirname + process.env.ORDERS_PATH))
                orders[order.type].push(order.data)

            jsonFile.writeFileSync(path.join(__dirname + process.env.ORDERS_PATH), orders)
        } catch (e) {
            reject({
                success: false,
                code: 'ERRADDORDER',
                e
            })
        }

        resolve({
            success: true
        })
    })
}
Log.prototype.removeOrder = function(id) {
    return new Promise((resolve, reject) => {
        try {
            let orders = jsonFile.readFileSync(path.join(__dirname + process.env.ORDERS_PATH))

            orders = orders.buy.map(order => {
                if (order.id === id) {
                    return false
                } else {
                    return order
                }
            })

            jsonFile.writeFileSync(path.join(__dirname + process.env.ORDERS_PATH), orders)

            resolve({
                success: 1,
                id
            })
        } catch (e) {
            reject({
                success: false,
                code: "ERR_REMOVE_ORDERS",
                id: id,
                e
            })
        }
    })
}

Log.prototype.getByPair = function () {

}
Log.prototype.getByPercent = function() {
    
}

Log.prototype.sendTelegram = function() {
    
}

module.exports = new Log()