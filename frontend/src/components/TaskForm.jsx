import { useState } from "react"

export default function TaskForm() {
    const [name, setName] = useState("")
    const [language, setLanguage] = useState("javascript")
    const [code, setCode] = useState("")
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    async function handler() {
        if (!name || !code) { alert("Please fill in all fields"); return }
        setLoading(true)
        setResult(null)
        try {
            let resp = await fetch("https://code-verification-backend.onrender.com/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, language, command: code })
            })
            let data = await resp.json()
            setResult(data.data || data)
        } catch (error) {
            console.error("Error submitting code:", error)
        }
        setLoading(false)
    }

    const placeholder = {
        javascript: `console.log("Hello World");`,
        c: `#include <stdio.h>\nint main() { printf("Hello"); return 0; }`,
        cpp: `#include <iostream>\nint main() { std::cout << "Hello"; }`,
        java: `public class Main {\n  public static void main(String[] a) {\n    System.out.println("Hello");\n  }\n}`,
        mips: `.data\nmsg: .asciiz "Hello World"\n.text\nmain:\n  li $v0, 4\n  la $a0, msg\n  syscall\n  li $v0, 10\n  syscall`
    }

    return (
        <div>
            <h2>Submit Code</h2>
            <label>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Hello World" />
            <label>Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="javascript">JavaScript</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="mips">MIPS Assembly</option>
            </select>
            <label>Your Code</label>
            <textarea className="code-input" value={code} onChange={e => setCode(e.target.value)} placeholder={placeholder[language]} />
            <button className="btn" onClick={handler} disabled={loading}>
                {loading ? "Saving..." : "Submit"}
            </button>
            {result && (
                <p style={{ marginTop: "1rem", color: "#333" }}>
                    <strong>{result.name}</strong> is completed, click run to execute the code.
                </p>
            )}
        </div>
    )
}
