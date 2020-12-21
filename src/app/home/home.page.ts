import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['../app.component.scss'],
})
export class HomePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  goToSuggestionsPage(orig: string) {
    this.router.navigate(['suggestion'], { queryParams: { origin: orig}});
  }
}
