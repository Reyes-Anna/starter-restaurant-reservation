import React, {useState} from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import NewReservation from "../reservations/NewReservation";
import EditReservation from "../reservations/EditReservation"
import SeatReservation from "../reservations/SeatReservation"
import NewTable from "../tables/NewTable"
import SearchReservation from "../reservations/SearchReservation"


/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */


function Routes() {
  const [date, setDate] = useState()
  const [newError, setNewError] = useState(false);

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

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} setDate={setDate} />
      </Route>
      <Route exact={true} path ="/reservations/new">
        <NewReservation 
          formatDate={formatDate}
          formatTime={formatTime}
          newError={newError} 
          setNewError={setNewError}/>
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation
          formatDate={formatDate}
          formatTime={formatTime} 
          newError={newError} 
          setNewError={setNewError}/>
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation 
          newError={newError} 
          setNewError={setNewError}/>
      </Route>
      <Route path="/tables/new">
        <NewTable 
          newError={newError} 
          setNewError={setNewError}/>
      </Route>
      <Route path="/search">
        <SearchReservation 
          newError={newError} 
          setNewError={setNewError}/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
