import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from 'src/app/interfaces';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.scss']
})
export class DasboardComponent implements OnInit {

  name = '';
  toady = new Date();

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const user: User = this.authService.getUser();
      this.name = user.FirstName;
    } else {
      this.router.navigate(['./login']);
    }

    // get value Toady is Sunday
    this.toady = new Date();
  }

  pickSubjects() {
    this.router.navigate(['./subjects']);
  }
}
