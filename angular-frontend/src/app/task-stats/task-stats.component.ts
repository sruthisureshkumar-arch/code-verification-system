import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, map } from 'rxjs';

@Component({
  selector: 'app-task-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" *ngIf="statsInfos$ | async as info">
      <h2>Verification Stats</h2>
      <p>Total experiments: {{ info.total }}</p>
      <p>With at least 1 pass: {{ info.completed }}</p>
      <div *ngIf="info.stats.length > 0" style="margin-top: 12px">
        <div *ngFor="let s of info.stats" class="stat-row">
          <span style="flex: 1"><strong>{{ s.taskName }}</strong></span>
          <span style="margin-right: 12px">Runs: {{ s.totalExecutions }}</span>
          <span style="margin-right: 12px; color: green">Pass: {{ s.successfulExecutions }}</span>
          <span style="color: red">Fail: {{ s.failedExecutions }}</span>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TaskStatsComponent implements OnInit {
  private statsSubject = new BehaviorSubject<any[]>([]);
  
  statsInfos$ = this.statsSubject.asObservable().pipe(
      map(stats => ({
          stats,
          total: stats.length,
          completed: stats.filter((t: any) => t.successfulExecutions > 0).length
      }))
  );

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchStats();
  }

  fetchStats() {
    this.http.get<any>('https://code-verification-backend.onrender.com/api/tasks/stats').subscribe({
      next: (data) => {
        const statsData = data.data || data;
        this.statsSubject.next(Array.isArray(statsData) ? statsData : []);
      },
      error: (err) => { console.error('Error fetching stats:', err); }
    });
  }
}
