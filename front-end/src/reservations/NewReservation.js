import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createReservation } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";


function NewReservation({ formatDate, formatTime}) {
    const history = useHistory()
    
    const initialReservationFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    
    }

    const [newReservation, setNewReservation] = useState({...initialReservationFormState});
    const [newError, setNewError] = useState(false);
    const abortController = new AbortController()

    async function submitHandler(event) {
        event.preventDefault()
        setNewError(false)
        try {
            await createReservation(newReservation)
            history.push(`/dashboard?date=${newReservation.reservation_date}`)
        }
        catch(error) {
            if(error.name !== "AbortError") {
                setNewError(error)
            }
        }
        return () => {abortController.abort()}
    }

    const changeHandler = ({target}) => {
        const { name, value } = target
        switch(name) {
            case "reservation_date":
                setNewReservation({...newReservation, [name]: formatDate(value) })
                break;
            case "reservation_time":
                setNewReservation({...newReservation, [name]: formatTime(value) })
                break;
            case "people":
                setNewReservation({...newReservation, [name]: parseInt(value) })
                break;
            default:
                setNewReservation({...newReservation, [name]: value })
        }
      }

    return (
        <div className="container fluid">
            <h2>Create New Reservation</h2>
            <ErrorAlert error={newError} />
            <ReservationForm 
                reservation={newReservation}
                submitHandler={submitHandler}
                changeHandler={changeHandler}
            />
        </div>
    )
}

export default NewReservation