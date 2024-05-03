import React from "react";
import { deleteReservation } from "../utils/api";

function ListTables({table, setTablesError, loadDashboard}) {
    return ([])
//     const handleFinish = (event) => {
//         event.preventDefault();
//         const message = "Is this table ready to seat new guests? This cannot be undone.";
//         if (window.confirm(message)) {
//           deleteReservation(table.table_id)
//             .then(() => loadDashboard())
//             .catch(setTablesError);
//         }
//       }
//  return (<>
//     <div className="card">
//       <div className="card-body">
//         <span className="badge capacity-badge">
//           {/* <Icon className="people-icon" icon="bi:people" color="#f8f8f4" /> */}
//           {/* table.capacity */}
//         </span>

//         <h6 className="card-title">{table.table_name }</h6>
//         <p className="card-subtitle mb-2 text-muted">Reservation {table.reservation_id}</p>
//         <div 
//           className={`alert ${table.reservation_id ? "alert-warning" : "alert-success"}`} 
//           id="statusWithFinishButton"
//           role="alert" 
//           data-table-id-status={table.table_id}>
//             {table.reservation_id ? "Occupied" : "Free"}
//             {table.reservation_id && 
//               <button 
//                 type="button" 
//                 className="btn"
//                 id="finishButton"
//                 onClick={handleFinish}
//                 data-table-id-finish={table.table_id}>
//                   Finish
//                 </button>
//             }
//         </div>
//       </div>
//     </div>
//   </>)
}

export default ListTables