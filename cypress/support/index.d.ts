// cypress/support/index.d.ts
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Configura los mocks para la API de productos
     * @example cy.mockProductsAPI()
     */
    mockProductsAPI(): Chainable<void>;
    
    /**
     * Verifica que los mocks estén funcionando correctamente
     * @example cy.verifyMocksWorking()
     */
    verifyMocksWorking(): Chainable<void>;
  }
}

// Definir tipos para el modelo Product
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
}