import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { previous, next, today } from "../utils/date-time";

function NavigationButtons({ currentDate }) {
    const history= useHistory()
    return (
        <div className= "mb-4">
            <button 
                className="btn btn-primary mx-1 " 
                onClick={() => history.push(`dashboard?date=${previous(currentDate)}`)} 
                type="button">
                    Previous
            </button>
            <button 
                className="btn btn-primary mx-1 px-3"
                onClick={() => history.push(`dashboard?date=${today()}`)} 
                type="button">
                    Today
            </button>
            <button 
                className="btn btn-primary mx-1 px-3"
                onClick={() => history.push(`dashboard?date=${next(currentDate)}`)} 
                type="button">
                    Next
            </button>
        </div>
    )
}

export default NavigationButtons