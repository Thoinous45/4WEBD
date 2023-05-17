const db = require('../database/db')
const Axios = require('axios')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
const qr = require('qr-image')
const jwt = require('jsonwebtoken')
const generateTokenToQrCode = (info) => {
    return JSON.stringify({
        token: jwt.sign(
            {
                ticket_id: info.ticket_id,
                event_name: info.event_name,
                event_date: info.event_date,
                event_place: info.event_place,
                event_price: info.price,
                number_reservation: info.number_reservation,
                firstname: info.firstname,
                lastname: info.lastname,
                email: info.email,
                payment: info.payment
            }, process.env.TOKEN_KEY)
    })

}
const sendEmailToClient = async (ticket_info, address, callback) => {

    console.log(address)

    const ticket_id = ticket_info.ticket_id
    const event_date = ticket_info.date
    const event_name = ticket_info.event_name
    const event_place = address
    const user = ticket_info.firstname + " " + ticket_info.lastname
    const payment_method = ticket_info.payment
    const number_reservation = ticket_info.number_reservation
    const email = ticket_info.email
    const event_price = ticket_info.price

    const tokenGenerate = JSON.parse(generateTokenToQrCode(ticket_info))

    const url = "http://localhost:3505/api/tickets/check/" + tokenGenerate.token
    const qrcode = await qr.imageSync(url, {type: 'png'})

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "entreprise.ticket.supinfo@gmail.com",
            pass: "uwfliwebejpaekxx"
        }
    })

    const handlebarOptions = {
        viewEngine: {
            extName: '.html',
            partialsDir: path.resolve('./templates/'),
            defaultLayout: false
        },
        viewPath: path.resolve('./templates/'),
    }

    transporter.use('compile', hbs(handlebarOptions))

    const mailOptions = {
        from: 'entreprise.ticket.supinfo@gmail.com',
        to: email,
        subject: 'Purchase ticket',
        template: 'email',
        attachDataUrls: true,
        attachments: [{filename: 'qrcode.png', content: qrcode, cid: 'qrcode'}, {
            filename: 'ticket.png',
            content: qrcode
        }],
        context: {
            user: user,
            ticket_id: ticket_id,
            event_name: event_name,
            event_date: event_date,
            event_place: event_place,
            event_price: event_price,
            number_reservation: number_reservation,
            payment_method: payment_method
        }
    }

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            callback(false)
        } else {
            callback(true)
        }
    })
}
const checkIfHeCanBuyTicket = async (price, numberCard, end_validity_date, cvv, callback) => {
    if (price === null || price === undefined) {
        callback(false)
    } else {
        try {
            await Axios.post("http://api-bank:3506/api/payment", {
                price: price,
                numberCard: numberCard,
                end_validity_date: end_validity_date,
                cvv: cvv,
                accountToTransfer: "2412751234123455"
            }).then((response) => {
                if(response.status !== 200){
                    callback(false)
                } else {
                    callback(true)
                }
            })
        } catch (e) {
            callback(false)
        }

    }

}
const checkEvent = async (event_id, callback) => {
    try {
        await Axios.get("http://events-api:8080/api/events/" + event_id).then((response) => {
            if (response.data) {
                callback(response.data)
            } else {
                callback(false)
            }
        })
    } catch (e) {
        callback(false)
    }
}
const bookAnAwaitTicket = async (id_event , callback) => {
    await Axios.get("http://events-api:8080/api/events/book/" + id_event).then((response) => {
        if (response.status === 200) {
            callback(true)
       } else {
            callback(false)
        }
    })
}
const userCantByTicket = (event_id) => {
    Axios.post("http://events-api:8080/api/events/book/revert/" + event_id).then((response) => {
        if (response.status === 200) {
            console.log("ok")
        } else {
            console.log("error")
        }
    })
}
const insertTicket = (user_id, firstname, lastname, event_id, email, date, payment, event_name,ticketPrice, callback) => {
    const insert_value = () => {
        const random = Math.floor(Math.random() * 1000000000000000000000)
        const number_reservation = "RESERVATION" + random

        const values = [user_id, firstname, lastname, event_id, email, date.toString(), payment, event_name, number_reservation,ticketPrice]
        const sql = "INSERT INTO tickets (user_id, firstname, lastname, event_id, email, date, payment, event_name, number_reservation, price ) VALUES (?,?,?,?,?,?,?,?,?,?)"
        db.query(sql, values, (err, results) => {
            if (err) {
                insert_value()
            }
            if (results) {
                const ticket_id = results.insertId
                const sql = "SELECT * FROM tickets WHERE ticket_id = ?"
                db.query(sql, ticket_id, (err, results) => {
                    callback(results[0])
                })
            }
        })
    }

    insert_value()
}
const createTicket = (req, res) => {
    const tokenUser = req.decodedToken
    const firstname = tokenUser.userFirstname
    const lastname = tokenUser.userLastname
    const user_id = tokenUser.userId
    const email = tokenUser.userEmail

    const event_id = req.body.event_id

    checkEvent(event_id, (result) => {
        if (result.length === 0) {
            return res.status(400).json({message: "Event not found"})
        }

        const event = result
        const event_name = event.name
        const address = event.address
        const startDate = event.startDate
        const reservationLimitDate = event.reservationLimitDate
        const ticketPrice = event.ticketPrice
        const nbOfPlaces = event.nbOfPlaces
        const numberCard = req.body.numberCard
        const end_validity_date = req.body.end_validity_date
        const cvv = req.body.cvv

        if(nbOfPlaces === 0) {
            return res.status(400).json({message: "No place available"})
        }

        if(new Date(reservationLimitDate) < new Date()) {
            return res.status(400).json({message: "Reservation limit date is over"})
        }

        bookAnAwaitTicket(event_id, (result) => {
            if (!result) {
                return res.status(400).json({message: "No place available"})
            }

            checkIfHeCanBuyTicket(ticketPrice, numberCard, end_validity_date, cvv, async (result) => {
                if (!result) {
                    userCantByTicket(event_id)
                    return res.status(403).json({message:"Payment refused"})
                }

                await insertTicket(user_id, firstname, lastname, event_id, email,startDate, "Carte bleue", event_name,ticketPrice, (result) => {
                    sendEmailToClient(result, address, (result) => {
                        if (!result) {
                            return res.status(400).json({message: "New ticket add / Error when sending email"})
                        }
                        return res.status(200).json({message: "New ticket add / send email"})
                    })
                })
            })
        })
    })
}
const getAllTickets = (req, res) => {
    const tokenUser = req.decodedToken
    if (!((tokenUser.userRight).toLowerCase() === "admin" || (tokenUser.userRight).toLowerCase() === "operator")) return res.status(400).json({message: "You can't access to this ticket pute"})
    const sql = "SELECT * FROM tickets";
    db.query(sql, (err, results) => {
        if (err) return res.status(400).json({Error: err})
        return res.status(200).json(results)
    })
}
const getTicketByIdUser = (req, res) => {
    const tokenUser = req.decodedToken
    const id = req.params.id

    if ((id !== tokenUser.userId) && ((tokenUser.userRight).toLowerCase() !== "admin")) return res.status(400).json({message: "You can't access to this ticket"})

    const sql = "SELECT * FROM tickets WHERE user_id = ?"
    db.query(sql, id, (err, results) => {
        if (err) return res.status(400).json({Error: err})
        return res.status(200).json(results)
    })
}
const checkTicket = (req, res) => {
    try {
        const decodedToken = jwt.verify(req.params.token, process.env.TOKEN_KEY);
        const ticket_id = decodedToken.ticket_id
        const event_name = decodedToken.event_name
        const number_reservation = decodedToken.number_reservation
        const firstname = decodedToken.firstname
        const lastname = decodedToken.lastname
        const email = decodedToken.email
        const payment = decodedToken.payment

        const sql = "SELECT * FROM tickets WHERE ticket_id = ? AND event_name = ? AND number_reservation = ? AND firstname = ? AND lastname = ? AND email = ? AND payment = ?"
        db.query(sql, [ticket_id, event_name, number_reservation, firstname, lastname, email, payment], (err, results) => {
            if (err) return res.status(400).json({Error: err})
            if (!results.length) return res.status(400).json({message: "Ticket not found"})
            return res.status(200).json({message: "Ticket found"})
        })
    } catch (err) {
        return res.status(400).json({message: "Token invalid"})
    }

}

module.exports = {createTicket, getAllTickets, getTicketByIdUser, checkTicket}
