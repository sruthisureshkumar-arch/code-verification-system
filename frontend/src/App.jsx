import TaskForm from './components/TaskForm.jsx'
import './index.css'

export default function App() {
    return (
        <div className="app-container">
            <div className="header">
                <h1>Code Verification System</h1>
                <p>Submit code and verify if it runs correctly</p>
            </div>
            <div className="nav-links">
                <button className="btn-submit">Submit</button>
                <a href="https://code-verification-system-angular.vercel.app/list"><button className="btn-run">Run</button></a>
                <a href="https://code-verification-system-angular.vercel.app/stats"><button className="btn-stats">Stats</button></a>
            </div>
            <TaskForm />
        </div>
    )
}
