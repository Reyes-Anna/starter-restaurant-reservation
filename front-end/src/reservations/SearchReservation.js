import { useState } from "react"
import ErrorAlert from "../layout/ErrorAlert"
import { listReservations } from "../utils/api"
import ListReservations from "./ListReservation"

function Search({ newError, setNewError }) {
    const [mobileNumber, setMobileNumber]= useState("")
    const [reservationSearch, setReservationSearch] = useState([])
    const abortController = new AbortController()

    const handleFind = (event) => {
        event.preventDefault()
        listReservations({mobileNumber}, abortController.signal)
        .then((reservationSearch) => setReservationSearch(reservationSearch))
        .catch((error) => setNewError(error))
    }

    const handleChange = ({ target }) => {
        setMobileNumber(target.value);
      }
    
    return(
        <div >
            <h2>Search For Reservation</h2>
            <ErrorAlert error={newError} />
            <div className="input-group mb-3">
                <input 
                    type="tel" 
                    name="mobile_number"
                    className="form-control" 
                    onChange={handleChange}
                    placeholder="Enter a customer's phone number" 
                 />
                <button 
                    className="btn btn-primary"
                    type="submit"
                    onClick={handleFind}
                >
                    <span className="oi oi-magnifying-glass" />
                     {` Find`}
                </button>
            </div>
            <div>
                {reservationSearch.length ?
                    reservationSearch.map((reservation, index) => (
                        <ListReservations 
                            key={index}
                            reservation={reservation}/> 
                    ))
                    : <h4>No reservations found</h4>
                }
            </div>
        </div>
    )
}

export default Search