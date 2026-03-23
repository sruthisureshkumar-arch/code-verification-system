import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <div class="header">
        <h1>Code Verification System</h1>
        <p>Submit code and verify if it runs correctly</p>
      </div>

      <div class="nav-links">
        <a href="https://code-verification-system.vercel.app"><button class="btn-submit">Submit</button></a>
        <button class="btn-run" routerLink="/list" routerLinkActive="active-link">Run</button>
        <button class="btn-stats" routerLink="/stats" routerLinkActive="active-link">Stats</button>
      </div>

      <router-outlet />
    </div>
  `,
  styles: []
})
export class App { }
