```
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
    private apiUrl = 'https://code-verification-backend.onrender.com/api';

    private tasksSubject = new BehaviorSubject<any[] | null>(null);
    tasks$ = this.tasksSubject.asObservable();

    constructor(private http: HttpClient) {
        this.fetchTasks(); // fetch once on app start
    }

    fetchTasks() {
        this.http.get<any>(this.apiUrl + '/tasks').subscribe({
            next: (res) => {
                const data = res.data || res;
                this.tasksSubject.next(Array.isArray(data) ? data : []);
            },
            error: () => this.tasksSubject.next([])
        });
    }

    get currentTasks() {
        return this.tasksSubject.value;
    }

    setTasks(tasks: any[]) {
        this.tasksSubject.next(tasks);
    }

    clearAll() {
        return this.http.delete(this.apiUrl + '/tasks');
    }

    triggerExecution(taskId: string) {
        return this.http.post<any>(this.apiUrl + '/executions/trigger/' + taskId, {});
    }

    getExecution(execId: string) {
        return this.http.get<any>(this.apiUrl + '/executions/' + execId);
    }
}
```
