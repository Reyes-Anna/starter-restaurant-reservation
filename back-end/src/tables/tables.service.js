const knex = require("../db/connection")

function list() {
    return knex("tables").select("*").orderBy("table_name")
}

function read(table_id) {
    return knex("tables").select("*").where({ table_id }).first()
}

function readReservationId(reservation_id) {
    return knex("tables as t")
    .join("reservations as r", "t.reservation_id", "r.reservation_id")
    .where({ reservation_id })
    .select("t.*")
    
}

function create(newTable) {
    return knex("tables")
    .insert(newTable, "*")
    .then((createTable) => createTable[0])
}

function update(updateTable) {
    return knex("tables")
    .where({ table_id: updateTable.table_id})
    .update(updateTable, "*")
    .then((update) => update[0])
}

module.exports ={
    list,
    read,
    readReservationId,
    create,
    update,
}