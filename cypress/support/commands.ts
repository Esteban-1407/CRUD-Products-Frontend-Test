// cypress/support/commands.ts

// Declaraciones de tipos para los comandos personalizados
declare global {
  namespace Cypress {
    interface Chainable {
      mockProductsAPI(): Chainable<void>;
      verifyMocksWorking(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('mockProductsAPI', () => {
  // Mock data para productos
  const mockProducts = [
    {
      id: 1,
      name: 'Producto Test 1',
      price: 100.50,
      description: 'Descripción del producto 1',
      category: 'Categoría A'
    },
    {
      id: 2,
      name: 'Producto Test 2',
      price: 200.75,
      description: 'Descripción del producto 2',
      category: 'Categoría B'
    },
    {
      id: 3,
      name: 'Producto Test 3',
      price: 150.25,
      description: 'Descripción del producto 3',
      category: 'Categoría A'
    }
  ];

  const newProduct = {
    id: 4,
    name: 'Nuevo Producto',
    price: 300.00,
    description: 'Producto creado en test',
    category: 'Categoría C'
  };

  // Interceptar GET /products - Obtener todos los productos
  cy.intercept('GET', 'http://localhost:8080/products', {
    statusCode: 200,
    body: mockProducts
  }).as('getProducts');

  // Interceptar POST /products - Crear nuevo producto
  cy.intercept('POST', 'http://localhost:8080/products', (req) => {
    const productData = req.body;
    const responseProduct = {
      ...productData,
      id: Date.now() // Simular ID generado
    };
    
    req.reply({
      statusCode: 201,
      body: responseProduct
    });
  }).as('createProduct');

  // Interceptar PUT /products/:id - Actualizar producto
  cy.intercept('PUT', 'http://localhost:8080/products/*', (req) => {
    const productData = req.body;
    
    req.reply({
      statusCode: 200,
      body: productData
    });
  }).as('updateProduct');

  // Interceptar DELETE /products/:id - Eliminar producto
  cy.intercept('DELETE', 'http://localhost:8080/products/*', (req) => {
    const urlParts = req.url.split('/');
    const productId = urlParts[urlParts.length - 1];
    const deletedProduct = mockProducts.find(p => p.id.toString() === productId);
    
    req.reply({
      statusCode: 200,
      body: deletedProduct || { id: parseInt(productId) }
    });
  }).as('deleteProduct');
});

// Comando para verificar que los mocks estén funcionando
Cypress.Commands.add('verifyMocksWorking', () => {
  cy.request('GET', 'http://localhost:8080/products').then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.be.an('array');
  });
});

// Exportar para evitar errores de módulo
export {};