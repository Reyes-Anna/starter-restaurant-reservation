import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { createTable } from "../utils/api"

function NewTable({newError, setNewError}) {
    const history= useHistory()
    const abortController = new AbortController()
    const [newTable, setNewTable] = useState({})

    async function submitHandler(event) {
        event.preventDefault()
        setNewError(false)
        try {
            await createTable(newTable)
            history.push("/dashboard")
        }
        catch(error) {
            if(error.name !== "AbortError") {
                setNewError(error)
            }
        }
        return () => {abortController.abort()}
    }
    return ([])
}

export default NewTable