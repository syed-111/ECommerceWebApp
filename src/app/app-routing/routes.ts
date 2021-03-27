import { Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { BookComponent } from '../book/book.component';
import { CartComponent } from '../cart/cart.component';

export const routes: Routes = [
  { path: 'home',  component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'book/:id',     component: BookComponent },
  { path: 'cart',     component: CartComponent },
];
