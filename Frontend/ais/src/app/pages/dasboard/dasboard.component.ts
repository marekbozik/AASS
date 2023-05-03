import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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
      this.name = this.authService.getUser().name;
    } else {
      this.router.navigate(['./login']);
    }

    // get value Toady is Sunday
    this.toady = new Date();
    console.log(this.toady.getDay());
  }

  pickSubjects() {
    this.router.navigate(['./subjects']);
  }
}
