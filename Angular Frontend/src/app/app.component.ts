import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LoginService } from './login.service'; // Import the login service

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
[x: string]: any|string;
  isSidenavOpened = true;
  public isAuthenticated = false;
  boardId = '1'; 
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private loginService: LoginService // Inject the login service
  ) {}

  ngOnInit() {
    // Subscribe to authentication status changes
    this.loginService.isAuthenticated$.subscribe(authStatus => {
      this.isAuthenticated = authStatus;
    });

    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isSidenavOpened = !result.matches;
      });
  }

  onSignIn() {
    this.router.navigate(['/loginform']);
  }

  onSignUp() {
    this.router.navigate(['/signupform']);
  }

  onLogout() {
    this.loginService.logout(); // Call the logout method in the service
    this.router.navigate(['/']);
  }

  onSettings() {
    // Logic for Settings
  }

  onThemes() {
    // Logic for changing themes
  }
}
