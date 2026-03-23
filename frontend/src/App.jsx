import TaskForm from './components/TaskForm.jsx'
import './index.css'

export default function App() {
    return (
        <div className="app-container">
            <div className="header">
                <h1>Code Verification System</h1>
                <p>Submit code in JavaScript, C, C++, Java or MIPS and verify if it works</p>
                <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                    Submit and Run Code
                </p>
            </div>
            <div className="nav-links">
                <button className="btn-submit" style={{ opacity: 1 }}>Submit</button>
                <a href="#"><button className="btn-run">Run</button></a>
                <a href="#"><button className="btn-stats">Stats</button></a>
            </div>
            <TaskForm />
        </div>
    )
}
