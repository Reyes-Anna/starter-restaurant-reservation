import React from "react";
import { updateStatus } from "../utils/api"

function ListReservations({ reservation, setReservationsError, loadDashboard}) {

    async function cancelHandler(event) {
        event.preventDefault();
        const abortController = new AbortController();
        const message = "Do you want to cancel this reservation? This cannot be undone.";
        if (window.confirm(message)) {
          try {
            await updateStatus(
              reservation.reservation_id,
              "cancelled",
              abortController.signal
            );
            window.location.reload(true);
          } catch (error) {
            if (error.name !== "AbortError") setReservationsError(error);
          }
        }
      }

    return (
        <div className="card mb-4" key={reservation.reservation_id}>
            <div className="card-header py-4"></div>
            <div className="card-body">
                <h5 className="card-title">{reservation.first_name} {reservation.last_name}</h5>
                <p className="card-text">Reservation Date: {reservation.reservation_date}</p>
                <p className="card-text">Reservation Time: {reservation.reservation_time}</p>
                <p className="card-text">Mobile Number: {reservation.mobile_number}</p>
                <p className="card-text">Party Size: {reservation.people}</p>
                <p className="card-text" data-reservation-id-status={reservation.reservation_id}>Status: {reservation.status}</p>
                <button 
                    className="btn mx-1 px-3"
                    data-reservation-id-cancel={reservation.reservation_id}
                    onClick={cancelHandler}
                    >
                        Cancel
                </button>
                {reservation.status === "booked" &&
                    <a 
                        href={`/reservations/${reservation.reservation_id}/edit`}
                        className="btn mx-1 px-3" >
                            Edit
                    </a>
                }
                {reservation.status === "booked" &&
                    <a 
                        href={`/reservations/${reservation.reservation_id}/seat`}
                        className="btn mx-1 px-3" >
                            Seat
                    </a>
                }
            </div>
        </div> 
    )
}

export default ListReservations