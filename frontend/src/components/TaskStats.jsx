import { useEffect, useState, useMemo } from "react"

export default function TaskStats() {
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        async function fetchTasks() {
            try {
                let resp = await fetch("https://code-verification-backend.onrender.com/api/tasks/stats")
                let data = await resp.json()
                setTasks(data.data || data)
            } catch (error) { console.error("Error fetching stats:", error) }
        }
        fetchTasks()
    }, [])

    const totalTasks = useMemo(() => tasks.length, [tasks])
    const completedTasks = useMemo(() => tasks.filter(t => t.successfulExecutions > 0).length, [tasks])

    return (
        <div className="card">
            <h2>Verification Stats</h2>
            <p>Total experiments: {totalTasks}</p>
            <p>With at least 1 pass: {completedTasks}</p>
        </div>
    )
}
