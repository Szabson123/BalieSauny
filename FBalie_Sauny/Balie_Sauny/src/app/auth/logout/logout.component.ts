import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  template: '',
  standalone: true,
})
export class LogoutComponent {
  constructor(private authService: AuthService) {
    this.authService.logout();
  }
}
