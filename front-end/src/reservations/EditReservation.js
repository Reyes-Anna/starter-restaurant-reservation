import React, {useEffect, useState} from "react"
import ErrorAlert from "../layout/ErrorAlert"
import ReservationForm from "./ReservationForm"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"
import { readReservation, updateReservation } from "../utils/api"

function EditReservation({formatDate, formatTime, newError, setNewError}) {
    const [reservationData, setReservationData] = useState({})
    const abortController = new AbortController()
    const history = useHistory()
    const { reservation_id } = useParams()

    useEffect(() => {
        async function loadReservation() {
                const response = await readReservation(reservation_id)
                response.reservation_date = formatDate(response.reservation_date)
                response.reservation_time = formatTime(response.reservation_time)
                setReservationData(response)
        }
        loadReservation()
    },[reservation_id, formatDate, formatTime])

    async function submitHandler(event) {
        event.preventDefault()
        setNewError(false)
        try {
            await updateReservation(reservationData, abortController.signal)
            history.push(`/dashboard?date=${reservationData.reservation_date.slice(0,10)}`)
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
                setReservationData({...reservationData, [name]: formatDate(value) })
                break;
            case "reservation_time":
                setReservationData({...reservationData, [name]: formatTime(value) })
                break;
            case "people":
                setReservationData({...reservationData, [name]: parseInt(value) })
                break;
            default:
                setReservationData({...reservationData, [name]: value })
        }
      }
    if(reservationData) {
        console.log(reservationData)
        return (
            <div className="container fluid">
                <h2>Edit Reservation</h2>
                <ErrorAlert error={newError} />
                <ReservationForm 
                    reservation={reservationData}
                    submitHandler={submitHandler}
                    changeHandler={changeHandler}
                />
            </div>
        )
    }
    return "Edit Page Loading"
}

export default EditReservation