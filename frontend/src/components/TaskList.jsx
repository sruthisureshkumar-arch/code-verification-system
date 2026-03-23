import { useEffect, useState } from "react"

export default function TaskList() {
    const [arr, setArr] = useState([])
    const [results, setResults] = useState({})

    async function getFromServer() {
        try {
            let resp = await fetch("http://localhost:5000/api/tasks")
            if (!resp.ok) throw new Error("Server not reachable")
            let data = await resp.json()
            setArr(data.data || data)
        } catch (error) { console.log("Error", error) }
    }

    async function runVerification(taskId) {
        setResults(prev => ({ ...prev, [taskId]: { status: "running" } }))
        try {
            let resp = await fetch(`http://localhost:5000/api/executions/trigger/${taskId}`, { method: "POST" })
            let data = await resp.json()
            let execId = data.data._id
            let attempts = 0
            const poll = async () => {
                try {
                    let r = await fetch(`http://localhost:5000/api/executions/${execId}`)
                    let execData = await r.json()
                    let exec = execData.data
                    if (exec.status === "completed" || exec.status === "failed") {
                        setResults(prev => ({ ...prev, [taskId]: exec }))
                    } else if (attempts < 10) { attempts++; setTimeout(poll, 1000) }
                } catch (e) { console.log(e) }
            }
            poll()
        } catch (error) {
            console.log("Run failed", error)
            setResults(prev => ({ ...prev, [taskId]: { status: "failed", output: "Could not connect to server" } }))
        }
    }

    async function clearAll() {
        try {
            await fetch("http://localhost:5000/api/tasks", { method: "DELETE" })
            setArr([])
            setResults({})
        } catch (error) { console.log("Error clearing", error) }
    }

    useEffect(() => { getFromServer() }, [])

    return (
        <div>
            <h2>Code History <button className="btn-outline" style={{ marginLeft: "10px" }} onClick={clearAll}>Clear All</button></h2>
            {arr.length === 0
                ? <p>No submissions yet.</p>
                : <ul style={{ listStyle: "none", padding: 0 }}>
                    {arr.map((a, index) => (
                        <li key={index} style={{ marginBottom: "8px", borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>
                            <strong>{a.name}</strong> ({a.language || "javascript"})
                            {" — "}
                            <button className="btn-outline" onClick={() => runVerification(a._id)}>Run &amp; Verify</button>
                            {results[a._id] && (
                                <div className={`result-box ${results[a._id].status === "completed" ? "pass" : results[a._id].status === "failed" ? "fail" : ""}`}>
                                    {results[a._id].status === "running"
                                        ? "running..."
                                        : results[a._id].status === "completed"
                                            ? `Super! No errors in code.\n\n${results[a._id].output || "(no output)"}`
                                            : `Oops! Execution terminated with errors.\n\n${results[a._id].error || results[a._id].output || "unknown error"}`
                                    }
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            }
        </div>
    )
}
