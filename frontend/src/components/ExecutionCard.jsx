import React, { useEffect, useState } from 'react'
import { usePolling } from '../hooks/usePolling'

const ExecutionCard = ({ executionId, onComplete }) => {
    const { data, error } = usePolling(executionId, 1000)
    const [showLogs, setShowLogs] = useState(false)

    useEffect(() => {
        if (data && (data.status === 'completed' || data.status === 'failed')) {
            setTimeout(() => { if (onComplete) onComplete() }, 5000)
        }
    }, [data, onComplete])

    if (error) return <div style={{ color: 'red' }}>Error polling</div>
    if (!data) return <div>Starting...</div>

    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{data.status} {data.durationMs ? `(${data.durationMs}ms)` : ''}</span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem' }}
                    onClick={() => setShowLogs(!showLogs)}>
                    {showLogs ? 'Hide Logs' : 'View Logs'}
                </button>
            </div>
            {showLogs && <div className="result-box">{data.logs || 'No logs output.'}</div>}
        </div>
    )
}

export default ExecutionCard
