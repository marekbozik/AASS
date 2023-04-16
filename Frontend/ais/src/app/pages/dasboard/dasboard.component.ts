import { Component, OnInit } from '@angular/core';
import { PagesService } from '../pages.service';
import { User } from 'src/app/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.scss']
})
export class DasboardComponent implements OnInit {

  name = '';

  constructor(
    private pagesService: PagesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.pagesService.isAuthenticated) {
      this.name = this.pagesService.authenticatedUser.FirstName || 'Marek Parek';
    } else {
      this.router.navigate(['./login']);
    }
  }
}
