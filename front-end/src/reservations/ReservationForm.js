
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function ReservationForm({reservation, submitHandler, changeHandler}) {
    const history = useHistory()
    return (
        <form onSubmit= {submitHandler}>
            <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input 
                    type="first_name"
                    name="first_name" 
                    className="form-control" 
                    id="first_name" 
                    value={reservation.first_name}
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
                    value={reservation.last_name}
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
                    value={reservation.mobile_number}
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    onChange={changeHandler}
                    placeholder="(XXX) XXX-XXXX"
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
                    value={reservation.reservation_date}
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
                    value={reservation.reservation_time}
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
                    value={reservation.people}
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

export default ReservationForm