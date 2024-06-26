import React, { useEffect, useState } from "react"
import ErrorAlert from "../layout/ErrorAlert"
import { listReservations } from "../utils/api"
import ListReservations from "./ListReservation"

function Search() {
    const inital = {
        mobile_number: ""
    }
    
    const [mobileNumber, setMobileNumber]= useState(inital)
    const [newError, setNewError] = useState(false);
    const [reservationSearch, setReservationSearch] = useState([])
    const [reservationMessage, setReservationMessage] = useState("")

    const abortController = new AbortController()

    useEffect(() => {
        const initalMobileNumber = {
            mobile_number: ""
        }
        setReservationSearch([])
        setMobileNumber(initalMobileNumber)
    }, [])
    
    const handleFind = (event) => {
        event.preventDefault()
        listReservations(mobileNumber , abortController.signal)
        .then((reservationSearch) => setReservationSearch(reservationSearch))
        .then(setReservationMessage("No reservations found!"))
        .catch((error) => setNewError(error))

        return () => abortController.abort()
    }

    const handleChange = ({ target }) => {
        setMobileNumber({ ...mobileNumber, [target.name]: target.value})
      }
      
    return(
        <div>
            <h2>Search For Reservation</h2>
            <ErrorAlert error={newError} />
            <div className="input-group mb-3">
                <input 
                    type="text" 
                    name="mobile_number"
                    className="form-control" 
                    onChange={handleChange}
                    placeholder="Enter a customer's phone number" 
                 />
                <button 
                    className="btn"
                    type="submit"
                    onClick={handleFind}
                >
                    <span className="oi oi-magnifying-glass" />
                     {` Find`}
                </button>
            </div>
            <div>
                {reservationSearch.length ?
                    reservationSearch.map((reservation) => (
                        <ListReservations 
                            key={reservation.reservation_id}
                            reservation={reservation}
                            setReservationsError={setNewError}
                            /> 
                    ))
                    : <h4>{reservationMessage}</h4>
                }
            </div>
        </div>
    )
}

export default Search