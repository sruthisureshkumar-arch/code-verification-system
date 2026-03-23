# Automated Execution Verification System

This is a full-stack application built to automate terminal command execution and verify the outcomes. It acts as a lightweight task runner where users can construct commands, execute them in real-time on the server, and track their pass/fail status and logs.

The project uses **both React and Angular** frontends talking to the same Express + MongoDB backend.

## 🌟 Features & Implemented "New Concepts"

1. **MongoDB**: **Aggregation Pipelines**
   - The `/backend/controllers/taskController.js` uses a MongoDB `$group` and `$project` aggregation pipeline to calculate real-time statistics (total runs, success rate, average duration) for each task.
2. **Express**: **Custom Error Handling Middleware**
   - The backend uses a centralized Error Handling Middleware (`/backend/middleware/errorHandler.js`) with a custom `AppError` class to intercept and precisely format errors (Mongoose CastErrors, ValidationErrors, etc.) across the entire application.
3. **React**: **Custom Hooks (`usePolling`)**
   - The frontend implements a reusable `usePolling` hook (`/frontend/src/hooks/usePolling.js`) to continuously ping the backend for an active execution's status, intelligently stopping once the process completes or fails.
4. **Node.js**: **Child Processes (`child_process.exec`)**
   - The core engine in `/backend/controllers/executionController.js` uses Node's native `child_process` module to spawn background OS shell environments and securely run the user-defined scripts/commands asynchronously.
5. **Angular**: **Standalone Components & HttpClient**
   - The Angular frontend (`/angular-frontend/`) uses standalone components with `HttpClient` for API communication and Angular Router for navigation.

## 🎯 Architecture — Two Frontends

| Feature | Framework | Port |
|---------|-----------|------|
| **Submit Code** | React (Vite) | `5173` |
| **Run & Verify** | Angular | `4200` |
| **Stats Dashboard** | Angular | `4200` |
| **Backend API** | Express.js | `5000` |

## 🗣 Supported Languages
- **JavaScript** — runs with Node.js
- **C** — compiles with `gcc`
- **C++** — compiles with `g++`
- **Java** — compiles with `javac`, runs with `java`
- **MIPS Assembly** — runs with MARS simulator (`java -jar Mars.jar`)

---

## 🛠 Prerequisites
- Node.js installed (v16+)
- MongoDB daemon running locally on `localhost:27017` (or provide a `MONGO_URI` in `.env`)
- Java installed (for MIPS execution via MARS simulator)

---

## 💻 Installation & Setup

### 1. Backend Server Setup
From the project root directory, navigate to the backend folder:
```bash
cd backend
npm install
npm run dev # (requires nodemon, or just run 'node server.js')
```
*Note: The backend will start on port `5000` connected to MongoDB `auto-exec-system`.*

### 2. Frontend React Application Setup
Open a new terminal session. From the project root, navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```
*Note: The React frontend will start on port `5173`. This handles the **Submit Code** page.*

### 3. Frontend Angular Application Setup
Open another terminal session. From the project root:
```bash
cd angular-frontend
npm install
ng serve
```
*Note: The Angular frontend will start on port `4200`. This handles the **Run & Verify** and **Stats** pages.*

---

## 🎮 How to use
1. Open your browser to the React app at `http://localhost:5173`.
2. Use the **Submit Code** page to enter code in JavaScript, C, C++, Java or MIPS Assembly.
3. Click **Submit** to save the code.
4. Navigate to the Angular app at `http://localhost:4200/list` (or click the **Run (Angular)** button).
5. Click **Run & Verify** on any submitted task to execute it.
6. Observe the polling mechanism updating the UI in real-time.
7. Visit `http://localhost:4200/stats` for the **Aggregation Pipeline Stats** dashboard.
