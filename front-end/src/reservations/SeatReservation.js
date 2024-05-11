import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { listTables, readReservation, seatReservation } from "../utils/api";

function SeatReservation() {
    const history = useHistory()
    const { reservation_id } = useParams()
    const [newError, setNewError] = useState(false);
    const [ reservation, setReservation] = useState([])
    const [ tables, setTables ] = useState([])
    const [ selectedTable, setSelectedTable] = useState({ reservation_id: reservation_id })

    useEffect(() => {
        const abortController = new AbortController()
        async function loadTables() {
            try {
                const response = await listTables(abortController.signal)
                setTables(response)


            }
            catch(error) {
                if(error.name !== "AbortError") setNewError(error)
            }
        }
        async function loadReservation() {
            try {
                const response = await readReservation(reservation_id, abortController.signal)
                setReservation(response)
            }
            catch(error) {
                if(error.name !== "AbortError") setNewError(error)
            }
        }
        loadTables()
        loadReservation()
        return () => abortController.abort()
    }, [reservation_id, setNewError] )

    async function submitHandler(event) {
        event.preventDefault();
        
        const abortController = new AbortController()
        try {
            await seatReservation(reservation.reservation_id, selectedTable.table_id, abortController.signal)
            history.push("/dashboard")
        }
        catch(error) {
            if(error.name !== "AbortError") setNewError(error)
        }
        return () => abortController.abort()
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
                        id="selectTable"
                        onChange={changeHandler}>
                        <option value=""> -Please pick a table -</option>
                        {tables.map((table) => ( 
                            <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
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