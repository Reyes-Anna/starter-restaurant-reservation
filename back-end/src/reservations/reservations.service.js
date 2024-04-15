const knex = require("../db/connection")

function list() {
    return knex("reservations").select("*")
}

function read(reservation_id) {
    return knex("reservations").select("*").where({ reservation_id }).first()

}

function create(newReservation) {
    return knex("reservations")
    .insert(newReservation, "*")
    .then((createReservation) => createReservation[0])
}

function listReservationsByTime(reservationDate) {
    return knex("reservations")
    .where({ "reservation_date": reservationDate })
    .orderBy("reservation_time")
}

module.exports = {
    list,
    listReservationsByTime,
    read,
    create,
}