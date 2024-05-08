import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservation from "../reservations/ListReservation"
import ListTables from "../tables/ListTables"
import NavigationButtons from "./NavigationButtons"
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery"
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom.min";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null)
  const query= useQuery()
  const route = useRouteMatch()

  useEffect(() => {
    function updateDate() {
      const queryDate = query.get("date");
      if (queryDate) {
        setDate(queryDate);
      } else {
        setDate(today());
      }
    }
    updateDate();
  }, [query, route, setDate]);
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <main>
    <h1>Dashboard</h1>
    <div>
      <h4 className="mb-2">Reservations for {date}</h4>
      <div id="reservationCard" >
          {reservations.map((reservation) => (
            <ListReservation 
              key={reservation.reservation_id}
              reservation={reservation}
              setReservationsError={setReservationsError}
              loadDashboard={loadDashboard}
            />
          ))}
        </div>
    </div>

    <ErrorAlert error={reservationsError} />
    <ErrorAlert error={tablesError} />

    <div className="d-md-flex flex-column">
      {!reservations.length && 
        <h4>No reservations on this date.</h4>
      }
    </div>
    <div className="text-center">
      <NavigationButtons currentDate={date}/>
    </div>
    <div>
      <h4>Tables</h4>
      {tables.map((table) => (
        <ListTables 
          key={table.table_id}
          table={table}
          setTablesError={setTablesError}
          loadDashboard={loadDashboard}
        />
      ))}
    </div>
  </main>
  )
}

export default Dashboard;
