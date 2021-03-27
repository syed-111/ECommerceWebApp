import { Injectable } from '@angular/core';
import { Product } from '../shared/product';
import { delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { Http ,HttpModule} from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class HttpserviceService {

  constructor(private http: HttpClient,
  private processHTTPMsgService: ProcessHTTPMsgService) { }
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(baseURL + 'products')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
  
  getCartProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(baseURL + 'cart')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
  
  putProduct(product: Product): Observable<Product> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Product>(baseURL + 'products/' + product.id, product, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));

  }


  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(baseURL + 'products/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }


  getProductIds(): Observable<number[] | any> {
    return this.getProducts().pipe(map(products => products.map(product => product.id)))
      .pipe(catchError(error => error));
  }
  
  
  deleteCartProduct(id: string) {
    return this.http.delete(baseURL + 'cart/' + id)
    .pipe(catchError(error => this.processHTTPMsgService.handleError(error)));
  }
  
  addProductToCart(product:Product){
  const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
  return this.http.post<Product>(baseURL + 'cart/' ,product,httpOptions)
  .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
