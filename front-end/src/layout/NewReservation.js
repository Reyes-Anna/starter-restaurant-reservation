import React from "react";

function NewReservation() {
    return (
    <form>
        
    <div class="form-group">
      <label for="firstName">First Name</label>
      <input type="firstName" class="form-control" id="firstName" placeholder="First Name"/>
    </div>
    <div class="form-group">
      <label for="lastName">Last Name</label>
      <input type="lastName" class="form-control" id="lastName" placeholder="Last Name"/>
    </div>
  <div class="form-group">
    <label for="moblieNumber">Mobile Number</label>
    <input type="mobileNumber" class="form-control" id="mobileNumber" placeholder="555-555-5555"/>
  </div>
  <div class="form-group">
    <label for="reservationDate">Reservation Date</label>
    <input type="date" class="form-control" id="reservationDate" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}"/>
  </div>

    <div class="form-group">
      <label for="reservation_time">Reservation Time</label>
      <input type="time" class="form-control" id="HH:MM" pattern="[0-9]{2}:[0-9]{2}"/>
    </div>
    <div class="form-group">
      <label for="people">Number of People in the Party</label>
      <input type="people" class="form-control" id="people"/>
    </div>
    <div className="d-grid gap-2 d-md-flex mb-4">
         <a className="btn btn-secondary mx-1" href={`/dashboard`} type="button">Cancel</a>
         <button className="btn btn-primary mx-1" type="submit">Submit</button>
      </div>
  
</form>
)
}

export default NewReservation