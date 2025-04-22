import { Component, OnInit, signal } from '@angular/core';
import { ProductsComponent } from './components/products/products.component';
import { Product } from './models/product';
import { FormComponent } from "./components/form/form.component";
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  imports: [ProductsComponent, FormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  products : Product[] = [];
  countId = signal(3);
  productSelected: Product = {id: 0, name: '', description: '', price: 0}
  constructor(private service: ProductService){}
  ngOnInit(): void {
    this.service.findAll().subscribe(products => this.products = products )
    // this.products = [
    //   {
    //     id:1,
    //     name:'Monitor 32 pulgadas',
    //     price:500,
    //     description:'No se'
    //   },
    //   {
    //     id:2,
    //     name:'Monitor 48 pulgadas',
    //     price:1020,
    //     description:'No se todavia'
    //   }
    // ]
  }

  

  addProduct(Product: Product) : void {
    if(Product.id > 0){
      this.service.update(Product).subscribe(productUpdated => {
        this.products = this.products.map(prod => {
          if(prod.id == Product.id){
            return { ...productUpdated };
          }
          return prod;
        });
      });
      
    } else {
      this.service.create(Product).subscribe(productNew => {
        this.products = [...this.products, { ...productNew }];
      })
      
    } 
  }
  
  onUpdateProductEvent(product: Product) : void {
    this.productSelected = { ...product };
  }
  
  onRemoveProductEvent(id: number): void {
    this.service.remove(id).subscribe(() => {
      this.products = this.products.filter(product => product.id != id);

    })
  }
}
  