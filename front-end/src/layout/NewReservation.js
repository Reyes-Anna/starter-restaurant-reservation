import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createReservation } from "../utils/api";

function NewReservation({newReservation, setNewReservation}) {
    const history = useHistory()



const submitHandler = async (event) => {
    event.preventDefault()
    await createReservation(newReservation)
    history.push("/dashboard")
}

const changeHandler = ({ target }) => {
    setNewReservation({ ...newReservation, [target.name]: target.value })
}

    return (
        <form onSubmit= {submitHandler}>
            <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input 
                    type="first_name" 
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
                    className="form-control" 
                    id="mobile_number" 
                    value={newReservation.mobile_number}
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    onChange={changeHandler}
                    placeholder="xxx-xxx-xxxx"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="reservation_date">Reservation Date</label>
                <input 
                    type="date" 
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
                <label for="people">Number of People in the Party</label>
                <input 
                    type="number"
                    min = "1"
                    max = "10"
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
    )
}

export default NewReservation