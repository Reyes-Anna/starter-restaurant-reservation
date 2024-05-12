const knex = require("../db/connection")

function list() {
    return knex("reservations").select("*").orderBy("reservation_time")
}

function read(reservation_id) {
    return knex("reservations").select("*").where({ reservation_id }).first()

}

function create(newReservation) {
    return knex("reservations")
    .insert(newReservation, "*")
    .then((createReservation) => createReservation[0])
}

function listByDate(reservation_date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date })
      .whereNot({status: "finished" })
      .whereNot({status: "cancelled"})
      .orderBy("reservation_time")
  }

function search(mobile_number) {
    return knex("reservations")
    .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
    
}

function update(updateReservation) {
    return knex("reservations")
    .where({ reservation_id: updateReservation.reservation_id})
    .update(updateReservation, "*")
    .then((update) => update[0])
}

module.exports = {
    list,
    listByDate,
    read,
    search,
    create,
    update,
}