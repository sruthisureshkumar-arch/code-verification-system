import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskStatsComponent } from './task-stats/task-stats.component';

export const routes: Routes = [
    { path: 'list', component: TaskListComponent },
    { path: 'stats', component: TaskStatsComponent },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
];
