const knex = require("../db/connection")

function list() {
    return knex("tables").select("*").orderBy("table_name")
}

function read(table_id) {
    return knex("tables").select("*").where({ table_id }).first()
}

function readReservationId(reservation_id) {
    return knex("reservations")
    .select("*")
    .where({"reservation_id": reservation_id })
    .first("*")
    
}

function create(newTable) {
    return knex("tables")
    .insert(newTable, "*")
    .then((createTable) => createTable[0])
}

async function update(updateTable, updateReservation) {
    const transaction = await knex.transaction()
    return transaction("tables")
    .where({ table_id: updateTable.table_id})
    .update(updateTable, "*")
    .then(updateRecords => updateRecords[0])
    .then(() => {
            return transaction("reservations")
            .select("*")
            .where({ "reservation_id": updateReservation.reservation_id })
            .update(updateReservation, "*")
            .then(updateResRecords => updateResRecords[0])
    })
    .then(transaction.commit)
    .catch(transaction.rollback)
}

module.exports ={
    list,
    read,
    readReservationId,
    create,
    update,
}