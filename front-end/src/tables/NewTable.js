import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { createTable } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert";

function NewTable() {
    const [newError, setNewError] = useState(false);
    const history= useHistory()
    const abortController = new AbortController()
    const initalTableForm = {
        table_name: "",
        capacity: "",
        
    }
    const [newTable, setNewTable] = useState({...initalTableForm})

    async function submitHandler(event) {
        event.preventDefault()
        setNewError(false)
        try {
            await createTable(newTable, abortController.signal)
            history.push("/dashboard")
        }
        catch(error) {
            if(error.name !== "AbortError") {
                setNewError(error)
            }
        }
        return () => {abortController.abort()}
    }

    function changeHandler({ target }) {
        const { name, value } = target
        switch(name) {
            case "capacity":
                setNewTable({...newTable, [name]: parseInt(value) })
                break;
            default:
                setNewTable({...newTable, [name]: target.value})
        }
    }

    return (
        <div>
            <ErrorAlert error={newError}/>
            <form onSubmit={submitHandler}>
                <h2>Create a new table</h2>
                <div className="form-group">
                    <label htmlFor="table_name">Table Name</label>
                    <input 
                        type="text"
                        name="table_name" 
                        className="form-control" 
                        id="table_name" 
                        value={newTable.table_name}
                        onChange={changeHandler}
                        placeholder="Table Name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="capacity">Capacity</label>
                    <input 
                        type="number"
                        name="capacity" 
                        className="form-control" 
                        id="capacity" 
                        value={newTable.capacity}
                        onChange={changeHandler}
                        placeholder="Capacity"
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

export default NewTable