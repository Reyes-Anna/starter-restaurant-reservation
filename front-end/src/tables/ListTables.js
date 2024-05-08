import React from "react";
import { deleteReservation } from "../utils/api";

function ListTables({table, setTablesError, loadDashboard}) {

    const finishButtonHandler = (event) => {
        event.preventDefault()
        const message = "Is this table ready to seat new guests? This cannot be undone.";
        if (window.confirm(message)) {
          deleteReservation(table.table_id)
            .then(() => loadDashboard())
            .catch(setTablesError);
        }
      }

    return (
        <div className="card mb-4">
            <div 
                className={`alert ${table.reservation_id ? "alert-warning" : "alert-success"}`} 
                id="statusBanner"
                role="alert" 
                data-table-id-status={table.table_id}>
                    <div className="row">
                        <div className="col">{table.reservation_id ? "Occupied" : "Free"}</div>
                        <div className=" col text-right"> Table Capacity: {table.capacity}</div> 
                    </div>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col">
                        <h5>Table {table.table_name}</h5>
                        <p> {table.reservation_id && `Reservation # ${table.reservation_id}`}</p>
                    </div>
                    <div className="col text-right py-2">
                        {table.reservation_id && 
                            <button 
                            type="button" 
                            className="btn btn-primary"
                            id="finishButton"
                            onClick={finishButtonHandler}
                            data-table-id-finish={table.table_id}>
                                Finish
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListTables