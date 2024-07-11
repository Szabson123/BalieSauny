import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService]
})
export class AppComponent implements OnInit {
  title = 'Balie_Sauny';
  isLoggedIn = false;
  isAdmin = false;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(token => {
      this.isLoggedIn = !!token;
      this.cdr.detectChanges(); // Trigger change detection
    });

    this.authService.isManager.subscribe(isManager => {
      this.isAdmin = isManager;
      this.cdr.detectChanges(); // Trigger change detection
    });

    if (this.isLoggedIn) {
      this.authService.getProfile().subscribe(); // Pobierz profil, jeśli użytkownik jest zalogowany
    }
  }

  logout() {
    this.authService.logout();
    setTimeout(() => {
      window.location.reload(); // Force reload the page
    }, 100);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
