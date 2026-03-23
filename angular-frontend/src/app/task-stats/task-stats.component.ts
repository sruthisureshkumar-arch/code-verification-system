import { Component, OnInit, ChangeDetectorRef, NgZone, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Verification Stats</h2>
      <p>Total experiments: {{ totalTasks() }}</p>
      <p>With at least 1 pass: {{ completedTasks() }}</p>
      <div *ngIf="stats().length > 0" style="margin-top: 12px">
        <div *ngFor="let s of stats()" class="stat-row">
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
  stats = signal<any[]>([]);
  totalTasks = computed(() => this.stats().length);
  completedTasks = computed(() => this.stats().filter((t: any) => t.successfulExecutions > 0).length);

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private zone: NgZone) { }

  ngOnInit() {
    this.http.get<any>('https://code-verification-backend.onrender.com/api/tasks/stats').subscribe({
      next: (data) => {
        this.zone.run(() => {
          const statsData = data.data || data;
          this.stats.set(Array.isArray(statsData) ? statsData : []);
          this.cdr.detectChanges();
        });
      },
      error: (err) => { console.error('Error fetching stats:', err); }
    });
  }
}
