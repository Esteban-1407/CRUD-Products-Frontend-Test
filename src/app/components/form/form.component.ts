import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'product-form',
  standalone: true, 
  imports: [FormsModule, CommonModule], 
  templateUrl: './form.component.html',
})
export class FormComponent {
  @Input() public product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0
  };

  @Output() addProductEvent = new EventEmitter();

  onSubmit(): void {
    // Elimina espacios
    this.product.name = this.product.name.trim();
    this.product.description = this.product.description.trim();

    if (!this.product.name || !this.product.description || this.product.price <= 0) {
      console.error('Form has invalid values');
      return;
    }

    console.log(this.product);
    this.addProductEvent.emit(this.product);
    this.clean();
  }

  clean(): void {
    this.product = {
      id: 0,
      name: '',
      description: '',
      price: 0
    };
  }
}
