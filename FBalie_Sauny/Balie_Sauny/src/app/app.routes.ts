import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainPageComponent } from './main-page/main-page.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShopComponent } from './shop/shop.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';


export const routes: Routes = [
    { path: '', component: MainPageComponent},
    { path: 'shop', component: ShopComponent},
    { path: 'shop/:id', component: ProductDetailComponent},
    { path: 'shop/:id/reservation', component: ReservationFormComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }