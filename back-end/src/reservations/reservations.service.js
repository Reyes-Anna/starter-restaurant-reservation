const knex = require("../db/connection")


function read(reservation_id) {
    return knex("reservations").select("*").where({ reservation_id }).first()

}

function create(newReservation) {
    return knex("reservations")
    .insert(newReservation, "*")
    .then((createReservation) => createReservation[0])
}

function list(reservation_date) {
    console.log("reservation date", reservation_date)
    return knex("reservations")
      .select("*")
      .where({ reservation_date })
      .whereNot({ status: "finished" })
      .orderBy("reservation_time");
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
    read,
    search,
    create,
}