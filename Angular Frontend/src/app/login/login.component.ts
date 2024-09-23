import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signinForm!: FormGroup;
  ckDep: boolean = false;
  showPassword: boolean = false;
  constructor(private fb: FormBuilder,
    private router: Router,private service: LoginService) {}

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      email: ['', Validators.required,[Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['', [Validators.required, Validators.pattern(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
      )]]
    });
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  onSignin(): void {
    if (this.signinForm.invalid) {
        this.ckDep = true;
        return;
    } else {
        console.log("login", this.signinForm.value);
        this.service.login(this.signinForm.value).subscribe(
            (res: any) => {
                Swal.fire({
                    icon: 'success',
                    title: 'User Login successfully!',
                    text: 'Welcome to User',
                    confirmButtonText: 'OK'
                });
                this.signinForm.reset();
                localStorage.setItem('token', res.token); // Save the token for later use
                this.router.navigate(["/home"]);
                console.log(res);
            },
            (err: any) => {
                if (err.status === 404) { 
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed!',
                        text: 'User does not exist',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed!',
                        text: 'Something went wrong. Please try again later.',
                        confirmButtonText: 'OK'
                    });
                }
                console.error('Error:', err);
            }
        );
    }
}

}
