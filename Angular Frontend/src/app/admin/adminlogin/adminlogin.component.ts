import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent {
  
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: LoginService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['admin'] // Default to admin
    });
  }

  ngOnInit(): void {}

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password, role } = this.loginForm.value;

      if (role === 'admin') {
        this.adminLogin(email, password);
      } else {
        this.userLogin();
      }
    }
  }

  adminLogin(email: string, password: string) {
    const adminCredentials = { username: email, password }; // Adjusted for consistency
    console.log(adminCredentials);
    this.authService.Adminlogin(adminCredentials).subscribe(
      response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', 'admin'); 
          this.router.navigate(['/admin/dashboard']); 
        } else {
          alert('Invalid admin credentials!');
        }
      },
      error => {
        alert('Invalid admin credentials!');
        console.error('Login error:', error);
      }
    );
  }

  userLogin() {
    alert('User login logic here.');
  }
}