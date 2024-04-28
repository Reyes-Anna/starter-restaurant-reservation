import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createReservation } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert";


function NewReservation() {
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
 

    function formatDate(date) {
        let formattedDate = date.split("");
        formattedDate.splice(10);
        formattedDate = formattedDate.join("")
        return formattedDate;
    }

    function formatTime(time) {
        let formattedTime = time.split("");
        formattedTime.splice(5);
        formattedTime = formattedTime.join("");
        return formattedTime
    }
   
    async function submitHandler(event) {
        event.preventDefault()
        setNewError(false)
        try {
            await createReservation(newReservation)
            history.push("/dashboard")
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
            <form onSubmit= {submitHandler}>
                <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <input 
                        type="first_name"
                        name="first_name" 
                        className="form-control" 
                        id="first_name" 
                        value={newReservation.first_name}
                        onChange={changeHandler}
                        placeholder="First Name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input 
                        type="last_name"
                        name="last_name" 
                        className="form-control" 
                        id="last_name" 
                        value={newReservation.last_name}
                        onChange={changeHandler}
                        placeholder="Last Name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="moblie_number">Mobile Number</label>
                    <input 
                        type="tel" 
                        name="mobile_number"
                        className="form-control" 
                        id="mobile_number" 
                        value={newReservation.mobile_number}
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        onChange={changeHandler}
                        placeholder="XXX-XXX-XXXX"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reservation_date">Reservation Date</label>
                    <input 
                        type="date" 
                        name="reservation_date"
                        className="form-control" 
                        id="reservation_date"
                        value={newReservation.reservation_date}
                        onChange={changeHandler} 
                        placeholder="YYYY-MM-DD" 
                        pattern="\d{4}-\d{2}-\d{2}"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="reservation_time">Reservation Time</label>
                    <input 
                        type="time"
                        name ="reservation_time" 
                        className="form-control" 
                        id="reservation_time"
                        value={newReservation.reservation_time}
                        onChange={changeHandler}
                        placeholder="HH:MM" 
                        pattern="[0-9]{2}:[0-9]{2}"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="people">Number of People in the Party</label>
                    <input 
                        type="number"
                        name= "people"
                        min={1}
                        className="form-control" 
                        id="people"
                        value={newReservation.people}
                        onChange={changeHandler}
                        
                        required
                        />
                </div>
                <div className="d-grid gap-2 d-md-flex mb-4">
                    <button className="btn btn-secondary mx-1" onClick={() => history.goBack()} type="button">Cancel</button>
                    <button className="btn btn-primary mx-1" type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default NewReservation