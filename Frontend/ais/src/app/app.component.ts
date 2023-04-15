
import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS } from './menu.data';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PagesService } from './pages/pages.service';

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
    private pagesService: PagesService,
  ) {
    this.pagesService.isAuthenticated.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  ngOnInit(): void {
  }

  logout() {
    this.pagesService.isAuthenticated.next(false);
    localStorage.removeItem('token');
    this.toastrService.success('Logout successful', '', {
      positionClass: 'toast-top-right'
    });

    this.router.navigate(['./login']);
  }
}
