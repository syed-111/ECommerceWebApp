import { Component, OnInit , Inject} from '@angular/core';
import { Product } from '../shared/product';
import { HttpserviceService } from '../services/httpservice.service';
import { flyInOut , expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
  '[@flyInOut]': 'true',
  'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {
  product: Product;
  products:Product[];
  errMess:string
  constructor(private httpservice: HttpserviceService,
    @Inject('BaseURL') private BaseURL
    ) { }

  ngOnInit() {
      
      this.httpservice.getProducts()
    .subscribe(products => this.products = products,
      errmess => this.errMess = <any>errmess);
  }

}
