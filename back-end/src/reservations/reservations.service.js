const knex = require("../db/connection")

function list() {
    return knex("reservatoins").select("*").orderBy("reservation_time")
}

function read(reservation_id) {
    return knex("reservations").select("*").where({ reservation_id }).first()

}

function create(newReservation) {
    return knex("reservations")
    .insert(newReservation, "*")
    .then((createReservation) => createReservation[0])
}

function listByDate(date) {
 //   console.log("reservation date", reservation_date)
    return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .whereNot({ status: "finished" })
      
  }

function search(mobile_number) {
    return knex("reservations")
    .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
}

module.exports = {
    list,
    listByDate,
    read,
    search,
    create,
}