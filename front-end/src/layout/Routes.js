import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from "./NewReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

import { useState } from "react";

function Routes() {

  const initalReservationFormState = {
    firstName: "",
    lastName: "",
    mobileNumber: "",
    reservationDate: "",
    reservationTime: "",
    people: "",
}

  const [newReservation, setNewReservation] = useState(initalReservationFormState)

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route exact={true} path ="/reservations/new">
        <NewReservation newReservation= {newReservation} setNewReservation={setNewReservation}/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
