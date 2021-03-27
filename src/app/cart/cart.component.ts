import { Component, OnInit, Inject  } from '@angular/core';
import { flyInOut , expand } from '../animations/app.animation';
import { Product } from '../shared/product';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  host: {
  '[@flyInOut]': 'true',
  'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class CartComponent implements OnInit {
  products: Product[];
  delete: boolean;
  errMess: string;

  constructor(private httpservice: HttpserviceService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.httpservice.getCartProducts()
    .subscribe(products => this.products = products,
      errmess => this.errMess = <any>errmess);
  }
  
  deleteFavorite(id: string) {
    console.log('Deleting Product ' + id);
    this.httpservice.deleteCartProduct(id)
      .subscribe(products => this.products = <Product[]>products,
        errmess => this.errMess = <any>errmess);
    this.delete = false;
  }

}
