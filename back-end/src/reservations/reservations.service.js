const knex = require("../db/connection")

function list() {
    return knex("reservations").select("*")
}

function read(reservation_id) {
    return knex("reservations").select("*").where({ reservation_id }).first()

}

function create(newReservation) {
    return knex("reservations")
    .insert(newReservation)
    .select("*")
}

function listReservationsByTime(reservationDate) {
    return knex("reservations")
    .select("*")
    .where({ "reservation_date": reservationDate })
    .orderBy("reservation_time")
}

module.exports = {
    list,
    listReservationsByTime,
    read,
    create,
}