import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShopComponent } from './shop/shop.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { AddTubComponent } from './add-tub/add-tub.component';
import { ReservationsToAcceptComponent } from './reservations-to-accept/reservations-to-accept.component';
import { AdminAllReservationsComponent } from './admin-all-reservations/admin-all-reservations.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LogoutComponent } from './auth/logout/logout.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'shop/:id', component: ProductDetailComponent },
  { path: 'shop/:id/reservation', component: ReservationFormComponent },
  { path: 'add-tub', component: AddTubComponent },
  { path: 'reservations-to-accept', component: ReservationsToAcceptComponent },
  { path: 'all-reservations', component: AdminAllReservationsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent }
];
