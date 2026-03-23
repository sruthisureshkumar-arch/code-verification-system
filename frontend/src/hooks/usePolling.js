import { useState, useEffect, useRef } from 'react'

export const usePolling = (executionId, interval = 1000) => {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const timerRef = useRef(null)

    useEffect(() => {
        if (!executionId) return

        const poll = async () => {
            try {
                let response = await fetch(`https://code-verification-backend.onrender.com/api/executions/${executionId}`)
                let dataPayload = await response.json()
                if (!response.ok) throw new Error('Polling failed')
                let responseData = dataPayload.data
                setData(responseData)
                if (responseData.status === 'completed' || responseData.status === 'failed') {
                    clearInterval(timerRef.current)
                }
            } catch (err) {
                console.error('Polling error', err)
                setError(err)
                clearInterval(timerRef.current)
            }
        }

        poll()
        timerRef.current = setInterval(poll, interval)
        return () => clearInterval(timerRef.current)
    }, [executionId, interval])

    return { data, error }
}
