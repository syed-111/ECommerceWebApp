import { Component, OnInit, Input,Inject } from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { Comment } from '../shared/comment';
import { visibility } from '../animations/app.animation';
import { flyInOut , expand } from '../animations/app.animation';
import { Product } from '../shared/product';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  animations: [
  visibility(),
  expand(),
  flyInOut()
  ]
})
export class BookComponent implements OnInit {
  product: Product;
  productIds: string[];
  prev: string;
  next: string;
  errMess: string;
  productcopy: Product;
  visibility = 'shown';
  pushSuccess :boolean;
  err:boolean;
  
  @ViewChild('fform') commentFormDirective;
  constructor(
    private httpservice: HttpserviceService,
    private route: ActivatedRoute,
    private location: Location,private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) { 
    this.createForm();
    }
    
  ngOnInit() {
    this.httpservice.getProductIds().subscribe(productIds => this.productIds = productIds,errmess => this.errMess = <any>errmess);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.httpservice.getProduct(+params['id']); }))
    .subscribe(product => { this.product = product; this.productcopy = product; this.setPrevNext(product.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
  }
  
  addToCart(product : Product)
  {
  console.log(product);
 
  this.httpservice.addProductToCart(product)
  .subscribe(product => this.pushSuccess=true,
        errMess => this.err=true);
  }

  setPrevNext(productId: string) {
    const index = this.productIds.indexOf(productId);
    this.prev = this.productIds[(this.productIds.length + index - 1) % this.productIds.length];
    this.next = this.productIds[(this.productIds.length + index + 1) % this.productIds.length];
  }
  
    goBack(): void {
    this.location.back();
  }
  commentForm: FormGroup;
  comment: Comment;
  

   createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating :5,
      comment: ['', [Validators.required]]
    });
    
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }
  
  formErrors = {
    'author': ''
  };
  
  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    }
  };
  
  
  onSubmit() {
    this.comment = this.commentForm.value;
    var d = new Date();
    var n = d.toISOString();
    this.comment.date=n;
    this.productcopy.comments.push(this.comment);
    this.httpservice.putProduct(this.productcopy)
      .subscribe(product => {
        this.product = product; this.productcopy = product;
      },
      errmess => { this.product = null; this.productcopy = null; this.errMess = <any>errmess; });
    console.log(this.comment);
    this.commentForm.reset({
      name: '',
      rating:5,
      comment: ''
    });
    this.commentFormDirective.resetForm();
  }
  
  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
