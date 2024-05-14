import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { listTables, readReservation, seatReservation } from "../utils/api";

function SeatReservation() {
    const history = useHistory()
    const { reservation_id } = useParams()
    const [ newError, setNewError] = useState(null);
    const [ reservation, setReservation] = useState([])
    const [ tables, setTables ] = useState([])
    const [ selectedTable, setSelectedTable] = useState({ reservation_id: reservation_id })

    useEffect(() => {
        async function loadReservation() {
            const response = await readReservation(reservation_id)
            setReservation(response)
        }
        loadReservation()
    }, [reservation_id] )

    useEffect(() => {
        async function loadTables() {
            const response = await listTables()
            setTables(response)
        }
        loadTables()
    }, [])

    const submitHandler=(event) => {
        event.preventDefault();
        seatReservation(reservation_id, selectedTable.table_id)
          .then(() => history.push("/dashboard"))
          .catch((error) => setNewError(error));
      }


    const changeHandler = ({ target }) => {
        setSelectedTable({...selectedTable, [target.name]: target.value })
    }
    

    return(
        <div>
            <ErrorAlert error={newError}/>
            <form onSubmit={submitHandler}>
                <h2>Assign Reservation {reservation.reservation_id} to a Table</h2>
                <div className="my-4">
                    <select
                        name="table_id"
                        id="table-select"
                        onChange={changeHandler}>
                        <option>-Please Select Table-</option>
                        {tables.map((table) => ( 
                            <option value={table.table_id} key={table.table_id}>{table.table_name} - {table.capacity}</option>
                        ))}
                    </select>
                </div>
                <div className="d-grid gap-2 d-md-flex mb-4">
                        <button className="btn btn-secondary mx-1" onClick={() => history.goBack()} type="button">Cancel</button>
                        <button className="btn btn-primary mx-1" type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default SeatReservation