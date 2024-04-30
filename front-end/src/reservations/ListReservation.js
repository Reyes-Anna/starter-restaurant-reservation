import { updateStatus } from "../utils/api"
function ListReservations({ reservation, setReservationsError, loadDashboard}) {

    function cancelHandler(event) {
        event.preventDefault();
        const message= "Do you want to cancel this reservation? This cannot be undone"
        if(window.confirm(message)) {
            updateStatus(reservation.reservation_id, "cancelled")
            .then(() => loadDashboard())
            .catch(setReservationsError)
        }
    }

    return (
        <div class="card mb-4" key={reservation.reservation_id}>
                    <div class="card-header py-3"></div>
                    <div class="card-body">
                        <h5 class="card-title">{reservation.first_name} {reservation.last_name}</h5>
                        <p class="card-text">Reservation Date: {reservation.reservation_date}</p>
                        <p class="card-text">Reservation Time: {reservation.reservation_time}</p>
                        <p class="card-text">Mobile Number: {reservation.mobile_number}</p>
                        <p class="card-text">Party Size: {reservation.people}</p>
                        <button 
                            class="btn btn-danger mx-1 px-3"
                            data-reservation-id-cancel={reservation.reservation_id}
                            onClick={cancelHandler}
                            >
                                Cancel
                        </button>
                        {reservation.status === "booked" &&
                            <a 
                                href={`/reservations/${reservation.reservation_id}/edit`}
                                className="btn btn-secondary mx-1 px-3" >
                                    Edit
                            </a>
                        }
                        {reservation.status === "booked" &&
                            <a 
                                href={`/reservations/${reservation.reservation_id}/seat`}
                                className="btn btn-secondary mx-1 px-3" >
                                    Seat
                           </a>
                        }
                    </div>
                </div> 
    )
}

export default ListReservations