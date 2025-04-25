import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public showHomeButton = true;
  constructor(
    private platform: Platform,
    private router: Router,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.handleMenuVisibility();
    });
  }

  handleMenuVisibility() {
    const hiddenRoutes = [
      '/landing',
      '/splash',
      '/login',
      '/signup',
      '/forgot-password'
    ];
  
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects;
        const shouldHide = hiddenRoutes.includes(currentUrl);
        this.menuCtrl.enable(!shouldHide);
        this.showHomeButton = !shouldHide; // 🔑 control home button too
      });
  }
  
}

