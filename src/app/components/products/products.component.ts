import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';

@Component({
  selector: 'table-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
})
export class ProductsComponent {

  @Input() products: Product[] = [];

  title = 'Listado de productos';
@Output() updateProductEvent = new EventEmitter();
  onUpdateProduct(product: Product): void{
    this.updateProductEvent.emit(product)
  }
  @Output() removeProductEvent = new EventEmitter();
  onRemoveProduct(id: Number): void{
    this.removeProductEvent.emit(id)
  }
}
