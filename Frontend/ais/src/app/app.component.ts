
import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS } from './menu.data';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './pages/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'AIS';
  menu = MENU_ITEMS;
  isAuthenticated = false;
  rememberMe = false;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService
  ) {
    this.authService.isAuthenticated().subscribe((res: any) => {
      if (res) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
        this.router.navigate(['./login']);
      }
    });
  }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
    this.toastrService.success('Logout successful', '', {
      positionClass: 'toast-top-right'
    });

    this.router.navigate(['./login']);
  }
}
