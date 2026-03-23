import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { TaskService } from './task.service';

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="taskService.tasks$ | async as tasksArr; else loading">
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

    <ng-template #loading>
      <p>Loading tasks...</p>
    </ng-template>
  `,
    styles: []
})
export class TaskListComponent implements OnInit {
    private resultsSubject = new BehaviorSubject<any>({});
    results$ = this.resultsSubject.asObservable();

    constructor(public taskService: TaskService) { }

    ngOnInit() {
        if (this.taskService.currentTasks === null) {
            this.taskService.fetchTasks();
        }
    }

    runVerification(taskId: string) {
        const currentResults = this.resultsSubject.value;
        this.resultsSubject.next({ ...currentResults, [taskId]: { status: 'running' } });

        this.taskService.triggerExecution(taskId).subscribe({
            next: (data) => { this.pollResult(taskId, data.data._id, 0); },
            error: () => {
                const current = this.resultsSubject.value;
                this.resultsSubject.next({ ...current, [taskId]: { status: 'failed', error: 'Server error' } });
            }
        });
    }

    private pollResult(taskId: string, execId: string, attempts: number) {
        this.taskService.getExecution(execId).subscribe({
            next: (data) => {
                const exec = data.data;
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
        this.taskService.clearAll().subscribe({
            next: () => {
                this.taskService.setTasks([]);
                this.resultsSubject.next({});
            },
            error: (err: any) => { console.log('Error clearing', err); }
        });
    }
}
