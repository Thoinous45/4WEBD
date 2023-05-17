const db = require("../database/db");

const checkIfCardIsAvailable = (numberCard, end_validity_date, cvv, callback) => {
    const sql = "SELECT * FROM account WHERE numberCard = ? AND end_validity_date = ? AND cvv = ?"
    const values = [numberCard, end_validity_date, cvv]
    db.query(sql, values, (err, results) => {
        if (err) {
            callback(false)
        }
        if (!results.length) {
            callback(false)
        } else {
            const end_validity_date = results[0].end_validity_date.substring(0, 2) + "/01/" + results[0].end_validity_date.substring(3, 7)

            const dateCard = new Date(end_validity_date)
            const dateNow = new Date()

            if (dateCard < dateNow) {
                callback(false)
            } else {
                callback(true)
            }
        }
    })

}
const checkIfHeCanBuy = (numberCard, end_validity_date, cvv, price, callback) => {
    const sql = "SELECT * FROM account WHERE numberCard = ? AND end_validity_date = ? AND cvv = ?"
    const values = [numberCard, end_validity_date, cvv]
    db.query(sql, values, (err, results) => {
        if (err) {
            callback(false)
        }
        if (!results.length) {
            callback(false)
        }

        const balance = results[0].balance

        if (balance < price) {
            callback(false)
        } else {
            callback(true)
        }

    })
}
const transaction = (numberCard, end_validity_date, cvv, price, accountToTransfer, callback) => {
    const firstTransaction = "UPDATE account SET balance = balance - ? WHERE numberCard = ? AND end_validity_date = ? AND cvv = ?"
    const valuesFirstTransaction = [price, numberCard, end_validity_date, cvv]
    db.query(firstTransaction, valuesFirstTransaction, (err, results) => {
        if (err) {
            callback(false)
        }
        if (results) {
            const secondTransaction = "UPDATE account SET balance = balance + ? WHERE numberCard = ?"
            const valuesSecondTransaction = [price, accountToTransfer]
            db.query(secondTransaction, valuesSecondTransaction, (err, results) => {
                if (err) {
                    callback(false)
                }
                if (results) {
                    callback(true)
                }
            })
        }
    })
}

const makePayment = (req, res) => {
    const price = req.body.price
    const numberCard = req.body.numberCard
    const end_validity_date = req.body.end_validity_date
    const cvv = req.body.cvv
    const accountToTransfer = req.body.accountToTransfer

    checkIfCardIsAvailable(numberCard, end_validity_date, cvv, (result) => {

        if (!result) return res.status(400).json({status: "false", message: "Card not found / Card not available"})

        checkIfHeCanBuy(numberCard, end_validity_date, cvv, price, (result) => {
            if (!result) return res.status(400).json({status: "false", message: "You can't buy"})

            transaction(numberCard, end_validity_date, cvv, price, accountToTransfer, (result) => {
                if (!result) return res.status(400).json({status: "false", message: "Transaction failed"})
                return res.status(200).json({status: "true", message: "Transaction success"})
            })
        })
    })
}

module.exports = { makePayment};
