import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import Swal from 'sweetalert2';
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
          Swal.fire({
            icon: 'success',
            title: 'Admin Login Successful!',
            text: 'You are being redirected to the admin dashboard.',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/admin/dashboard']);
          });
        } else {
          this.showLoginError();
        }
      },
      error => {
        this.showLoginError();
        console.error('Login error:', error);
      }
    );
  }

  userLogin() {
    Swal.fire({
      icon: 'info',
      title: 'User login',
      text: 'User login logic here.'
    });
  }

  showLoginError() {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: 'Invalid admin credentials!'
    });
  }
}