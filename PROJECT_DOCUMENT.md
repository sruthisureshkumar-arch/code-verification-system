# Code Verification System – Project Documentation


## 1. INTRODUCTION

Nowadays, most work in software is moving towards automation. Doing tasks manually takes more time and sometimes leads to mistakes. So, automating simple tasks can make work faster and easier. In this project, we have developed a **Code Verification System**. The main idea of this system is to help users submit code in multiple programming languages, run it on a server, and check whether it executes correctly — all without doing anything manually. Instead of writing code, compiling it separately, and checking outputs on their own, users can simply enter their code in the browser, submit it, run it with one click, and see the result clearly. It also stores the results so they can be checked later.


## 2. OBJECTIVE

The main goal of this project is to make code execution and verification simple and automatic.
The objectives are:
- To reduce manual compilation and execution work.
- To submit and execute code easily in multiple languages (JavaScript, C, C++, Java, MIPS).
- To check execution results quickly (pass or fail).
- To store execution details like output, errors, and duration.
- To show basic performance and statistics information using a dashboard.


## 3. SYSTEM OVERVIEW

This system works like a platform where users can submit code, run it, and get results.
The project has three main parts:

1. **Frontend (what the user sees):**
   - The React frontend lets users submit their code by entering a name, selecting a language, and writing the code.
   - The Angular frontend lets users run/verify submitted code and view execution statistics.

2. **Backend (where the logic happens):**
   - The Node.js/Express backend receives the code, writes it to a temporary file, compiles and runs it using the `child_process` module, and sends back the result.

3. **Database (where data is stored):**
   - MongoDB stores all submitted tasks and execution results, so users can review them anytime.


## 4. TECHNOLOGIES USED

1. **Frontend:**
   - React (for code submission page).
   - Angular (for code execution and statistics pages).
   - HTML.
   - CSS.
   - JavaScript / TypeScript.

2. **Backend:**
   - Node.js.
   - Express.js.

3. **Database:**
   - MongoDB.

4. **Build Tools:**
   - Vite (React frontend bundler).
   - Angular CLI (Angular frontend).

These technologies are used because they are simple, powerful, and commonly used in real projects.


## 5. FEATURES

1. **Code Submission:**
   - Users can enter a task name, select a programming language (JavaScript, C, C++, Java, or MIPS Assembly), write their code, and submit it.

2. **Code Execution:**
   - The system compiles and runs the submitted code on the server using Node.js `child_process` and collects the output.

3. **Status Checking:**
   - Each execution shows its status:
     - Running,
     - Completed (pass),
     - Failed (error).

4. **Logging:**
   - The system stores output, errors, and execution duration (in milliseconds). A dashboard page shows total tasks and success rate.

5. **Multi-Language Support:**
   - Supports JavaScript, C, C++, Java, and MIPS Assembly execution on the backend.

6. **Clear All:**
   - Users can clear all submitted tasks at once from the task list.


## 6. MODULES

1. **Code Submission Module (React):**
   - Provides a form to enter the task name, select a language, write code, and submit it to the backend.

2. **Execution Module (Angular – Task List):**
   - Displays all submitted tasks and lets the user click "Run & Verify" to execute the code on the server.

3. **Monitoring Module (Angular – Execution Polling):**
   - Polls the backend for execution results and shows the status (running, completed, or failed) with output/error details.

4. **Statistics Module (Angular – Task Stats):**
   - Uses MongoDB aggregation pipeline to show total executions, successful executions, and failed executions per task.


## 7. WORKING

The working is very simple:

1. User enters code in the React frontend, selects a language, and clicks Submit.
2. The code is sent to the Express.js backend via a REST API call.
3. The backend saves the task in MongoDB and writes the code to a temporary file.
4. The server compiles and runs the code using `child_process.exec`.
5. The result (output or error) is saved in the MongoDB `executions` collection.
6. The Angular frontend fetches and displays the result to the user.


## 8. ADVANTAGES

- Saves time by automating code compilation and execution.
- Easy to use with a clean web interface.
- Reduces errors by running code in a controlled server environment.
- Stores results properly in MongoDB for later review.
- Supports multiple programming languages in one platform.
- Helps in learning real-world full-stack development.


## 9. LIMITATIONS

- Security needs improvement (arbitrary code execution risk).
- Depends on server performance.
- No login system or user authentication.
- Limited to languages whose compilers are installed on the server.


## 10. FUTURE IMPROVEMENTS

- Add a login and user authentication system.
- Improve security with sandboxed code execution.
- Add automatic scheduling for batch executions.
- Improve UI design with more visual feedback.
- Add email or push notifications for execution results.


## 11. CONCLUSION

This project helped us to understand how to build a full-stack application using React, Angular, Node.js, Express, and MongoDB. The system allows users to submit code in multiple languages — JavaScript, C, C++, Java, and MIPS Assembly — through a React-based frontend, and then run and verify it through an Angular-based frontend. The backend handles the actual compilation and execution using Node.js child_process, writes temporary files to disk, and stores all execution results (output, errors, duration) in MongoDB. A statistics dashboard built with MongoDB aggregation pipelines gives a clear overview of total executions, successes, and failures.

This kind of system is very useful in a Computer Science and Engineering (CSE) department. It can be used as a tool for lab evaluations where students submit their programs and the system automatically compiles and verifies them, saving time for both students and faculty. It can also serve as a practice platform where students can test their code in different languages without needing to install compilers on their own machines. Additionally, the project itself demonstrates core full-stack development concepts — REST APIs, frontend frameworks, database operations, and server-side code execution — which are part of the CSE curriculum. Overall, the system is practical, easy to use, and can be improved further in the future to support more languages, user authentication, and automated grading.
