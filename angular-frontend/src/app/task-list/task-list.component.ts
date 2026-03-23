import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div>
      <h2>Code History
        <button class="btn-outline" style="margin-left: 10px" (click)="clearAll()">Clear All</button>
      </h2>
      <p *ngIf="tasks.length === 0">No submissions yet.</p>
      <ul style="list-style: none; padding: 0">
        <li *ngFor="let task of tasks" style="margin-bottom: 8px; border-bottom: 1px solid #ddd; padding-bottom: 8px">
          <strong>{{ task.name }}</strong> ({{ task.language || 'javascript' }})
          &mdash;
          <button class="btn-outline" (click)="runVerification(task._id)">Run &amp; Verify</button>
          <div *ngIf="results[task._id]"
               [class]="'result-box ' + (results[task._id].status === 'completed' ? 'pass' : results[task._id].status === 'failed' ? 'fail' : '')">
            <span *ngIf="results[task._id].status === 'running'">Running...</span>
            <span *ngIf="results[task._id].status === 'completed'">
              Passed<br><br>{{ results[task._id].output || '(no output)' }}
            </span>
            <span *ngIf="results[task._id].status === 'failed'">
              Failed<br><br>{{ results[task._id].error || results[task._id].output || 'unknown error' }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  `,
    styles: []
})
export class TaskListComponent implements OnInit {
    tasks: any[] = [];
    results: any = {};
    private apiUrl = 'https://code-verification-backend.onrender.com/api';

    constructor(private http: HttpClient) { }

    ngOnInit() { this.getTasks(); }

    getTasks() {
        this.http.get<any>(this.apiUrl + '/tasks').subscribe({
            next: (res) => {
                console.log('Backend response:', res);
                if (res && res.data && Array.isArray(res.data)) {
                    this.tasks = res.data;
                } else if (Array.isArray(res)) {
                    this.tasks = res;
                } else if (res && Array.isArray(res.tasks)) {
                    this.tasks = res.tasks;
                }
            },
            error: (err) => { console.log('Error fetching tasks', err); }
        });
    }

    runVerification(taskId: string) {
        this.results[taskId] = { status: 'running' };
        this.http.post<any>(this.apiUrl + '/executions/trigger/' + taskId, {}).subscribe({
            next: (data) => { this.pollResult(taskId, data.data._id, 0); },
            error: (err) => {
                console.log('Run failed', err);
                this.results[taskId] = { status: 'failed', output: 'Could not connect to server' };
            }
        });
    }

    private pollResult(taskId: string, execId: string, attempts: number) {
        this.http.get<any>(this.apiUrl + '/executions/' + execId).subscribe({
            next: (data) => {
                let exec = data.data;
                if (exec.status === 'completed' || exec.status === 'failed') {
                    this.results[taskId] = exec;
                } else if (attempts < 10) {
                    setTimeout(() => this.pollResult(taskId, execId, attempts + 1), 1000);
                } else {
                    this.results[taskId] = { status: 'failed', error: 'Timed out waiting for execution result. Please try again.' };
                }
            },
            error: (err) => { console.log(err); }
        });
    }

    clearAll() {
        this.http.delete(this.apiUrl + '/tasks').subscribe({
            next: () => { this.tasks = []; this.results = {}; },
            error: (err) => { console.log('Error clearing', err); }
        });
    }
}
