// cypress/e2e/product.cy.ts
describe('Products E2E Tests', () => {
  beforeEach(() => {
    // Interceptar las llamadas a la API directamente
    cy.intercept('GET', '**/products', {
      fixture: 'products.json'
    }).as('getProducts');

    cy.intercept('POST', '**/products', {
      statusCode: 201,
      body: {
        id: 4,
        name: 'Nuevo Producto Test',
        price: 250.00,
        description: 'Descripción del nuevo producto'
      }
    }).as('createProduct');

    cy.intercept('PUT', '**/products/*', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Producto Modificado',
        price: 350.00,
        description: 'Descripción modificada'
      }
    }).as('updateProduct');

    cy.intercept('DELETE', '**/products/*', {
      statusCode: 204
    }).as('deleteProduct');
    
    // Visitar la página principal
    cy.visit('/');
  });

  it('should display list of products', () => {
    // Verificar que la llamada GET se realizó
    cy.wait('@getProducts');
    
    // Verificar que los productos se muestran en la interfaz
    cy.get('[data-cy="product-list"]').should('be.visible');
    cy.get('[data-cy="product-item"]').should('have.length.at.least', 1);
    
    // Verificar contenido específico (ajusta según tus datos de fixture)
    cy.contains('Producto Test 1').should('be.visible');
    cy.contains('100.5').should('be.visible');
  });

  it('should create a new product', () => {
    // Verificar que el formulario esté visible
    cy.get('[data-cy="product-form"]').should('be.visible');
    
    // Llenar el formulario
    cy.get('[data-cy="product-name"]').type('Nuevo Producto Test');
    cy.get('[data-cy="product-price"]').type('250');
    cy.get('[data-cy="product-description"]').type('Descripción del nuevo producto');
    
    // Enviar el formulario
    cy.get('[data-cy="submit-btn"]').click();
    
    // Verificar que la petición POST se realizó
    cy.wait('@createProduct').then((interception) => {
      expect(interception.request.body).to.include({
        name: 'Nuevo Producto Test',
        price: 250,
        description: 'Descripción del nuevo producto'
      });
    });
  });

  it('should update an existing product', () => {
    // Esperar a que se carguen los productos
    cy.wait('@getProducts');
    
    // Hacer clic en editar el primer producto
    cy.get('[data-cy="edit-product-btn"]').first().click();
    
    // Verificar que el formulario se llene con los datos del producto
    cy.get('[data-cy="product-name"]').should('not.be.empty');
    
    // Modificar campos
    cy.get('[data-cy="product-name"]').clear().type('Producto Modificado');
    cy.get('[data-cy="product-price"]').clear().type('350');
    
    // Guardar cambios
    cy.get('[data-cy="submit-btn"]').click();
    
    // Verificar que la petición PUT se realizó
    cy.wait('@updateProduct').then((interception) => {
      expect(interception.request.body).to.include({
        name: 'Producto Modificado',
        price: 350
      });
    });
  });

  it('should delete a product', () => {
    // Esperar a que se carguen los productos
    cy.wait('@getProducts');
    
    // Hacer clic en eliminar
    cy.get('[data-cy="delete-product-btn"]').first().click();
    
    // Confirmar eliminación
    cy.get('[data-cy="confirm-delete-btn"]').click();
    
    // Verificar que la petición DELETE se realizó
    cy.wait('@deleteProduct');
    
    // Verificar que el producto fue eliminado de la interfaz
    cy.get('[data-cy="success-message"]').should('contain', 'Producto eliminado');
  });

  it('should handle API errors gracefully', () => {
    // Interceptar con error para probar manejo de errores
    cy.intercept('GET', '**/products', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('getProductsError');
    
    // Recargar la página
    cy.reload();
    
    // Verificar que se muestra mensaje de error o que no hay productos
    cy.wait('@getProductsError');
    // Ajustar según cómo manejes los errores en tu app
    cy.get('[data-cy="no-products-message"]').should('be.visible');
  });

  // Comentado hasta que implementes funcionalidad de búsqueda
  // it('should search and filter products', () => {
  //   cy.wait('@getProducts');
  //   
  //   // Usar filtro de búsqueda
  //   cy.get('[data-cy="search-input"]').type('Test 1');
  //   
  //   // Verificar que solo aparezcan productos filtrados
  //   cy.get('[data-cy="product-item"]').should('have.length', 1);
  //   cy.contains('Producto Test 1').should('be.visible');
  //   cy.contains('Producto Test 2').should('not.exist');
  // });
});