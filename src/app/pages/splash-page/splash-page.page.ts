import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-page',
  standalone: false,
  templateUrl: './splash-page.page.html',
  styleUrls: ['./splash-page.page.scss'],
})
export class SplashPagePage implements OnInit {

  constructor(private router: Router) { }
/** Timeout for loading screen */
  ngOnInit() {
      setTimeout(()=> {
      this.router.navigate(['landing']);
	  }, 6000); //// time before changing scr
  }
}

