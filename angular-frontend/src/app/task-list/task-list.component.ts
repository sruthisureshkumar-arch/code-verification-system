import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, map } from 'rxjs';

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="tasks$ | async as tasksArr">
      <h2>Code History
        <button class="btn-outline" style="margin-left: 10px" (click)="clearAll()">Clear All</button>
      </h2>
      <p *ngIf="tasksArr.length === 0">No submissions yet.</p>
      <ul style="list-style: none; padding: 0" *ngIf="tasksArr.length > 0">
        <li *ngFor="let task of tasksArr" style="margin-bottom: 8px; border-bottom: 1px solid #ddd; padding-bottom: 8px">
          <strong>{{ task.name }}</strong> ({{ task.language || 'javascript' }})
          &mdash;
          <button class="btn-outline" (click)="runVerification(task._id)">Run &amp; Verify</button>
          
          <ng-container *ngIf="results$ | async as resultsObj">
            <div *ngIf="resultsObj[task._id]"
                 [class]="'result-box ' + (resultsObj[task._id].status === 'completed' ? 'pass' : resultsObj[task._id].status === 'failed' ? 'fail' : '')">
              <span *ngIf="resultsObj[task._id].status === 'running'">Running...</span>
              <span *ngIf="resultsObj[task._id].status === 'completed'">
                Passed<br><br>{{ resultsObj[task._id].output || '(no output)' }}
              </span>
              <span *ngIf="resultsObj[task._id].status === 'failed'">
                Failed<br><br>{{ resultsObj[task._id].error || resultsObj[task._id].output || 'unknown error' }}
              </span>
            </div>
          </ng-container>
        </li>
      </ul>
    </div>
  `,
    styles: []
})
export class TaskListComponent implements OnInit {
    private tasksSubject = new BehaviorSubject<any[]>([]);
    tasks$ = this.tasksSubject.asObservable();

    private resultsSubject = new BehaviorSubject<any>({});
    results$ = this.resultsSubject.asObservable();

    private apiUrl = 'https://code-verification-backend.onrender.com/api';

    constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private zone: NgZone) { }

    ngOnInit() {
        this.getTasks();
    }

    getTasks() {
        this.http.get<any>(this.apiUrl + '/tasks').subscribe({
            next: (res) => {
                this.zone.run(() => {
                    const data = res.data || res;
                    this.tasksSubject.next(Array.isArray(data) ? data : []);
                    this.cdr.detectChanges();
                });
            },
            error: (err) => { console.log('Error fetching tasks', err); }
        });
    }

    runVerification(taskId: string) {
        const currentResults = this.resultsSubject.value;
        this.resultsSubject.next({ ...currentResults, [taskId]: { status: 'running' } });

        this.http.post<any>(this.apiUrl + '/executions/trigger/' + taskId, {}).subscribe({
            next: (data) => { this.pollResult(taskId, data.data._id, 0); },
            error: (err) => {
                const current = this.resultsSubject.value;
                this.resultsSubject.next({ ...current, [taskId]: { status: 'failed', error: 'Server error' } });
            }
        });
    }

    private pollResult(taskId: string, execId: string, attempts: number) {
        this.http.get<any>(this.apiUrl + '/executions/' + execId).subscribe({
            next: (data) => {
                let exec = data.data;
                const current = this.resultsSubject.value;
                if (exec.status === 'completed' || exec.status === 'failed') {
                    this.resultsSubject.next({ ...current, [taskId]: exec });
                } else if (attempts < 20) {
                    setTimeout(() => this.pollResult(taskId, execId, attempts + 1), 1000);
                } else {
                    this.resultsSubject.next({ ...current, [taskId]: { status: 'failed', error: 'Timed out.' } });
                }
            },
            error: (err) => { console.log(err); }
        });
    }

    clearAll() {
        this.http.delete(this.apiUrl + '/tasks').subscribe({
            next: () => {
                this.tasksSubject.next([]);
                this.resultsSubject.next({});
            },
            error: (err: any) => { console.log('Error clearing', err); }
        });
    }
}
