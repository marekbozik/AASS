import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }
  
  async login() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      (await this.authService.login(email, password)).subscribe((res: any) => {
        if (res.status === 200) {
          this.toastrService.success('Wellcome back!', 'Login successful', {
            positionClass: 'toast-top-right'
          });

          this.authService.setUser(res.body.user);
          this.router.navigate(['./dashboard']);
        }

        if (res.status === undefined) {
          this.toastrService.error('Email or password is invalid', 'Login failed', {
            positionClass: 'toast-top-right'
          });
        }
      });
    } else {
      this.toastrService.error('Email or password is invalid', 'Login failed', {
        positionClass: 'toast-top-right'
      });
    }
  }
}
