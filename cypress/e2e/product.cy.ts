// cypress/e2e/product.cy.ts
describe('Products E2E Tests', () => {
  beforeEach(() => {
    // Configurar mocks antes de cada prueba
    cy.mockProductsAPI();
    
    // Visitar la página principal (ajusta la ruta según tu aplicación)
    cy.visit('http://localhost:4200');
  });

  it('should display list of products', () => {
    // Verificar que la llamada GET se realizó
    cy.wait('@getProducts');
    
    // Verificar que los productos se muestran en la interfaz
    cy.get('[data-cy="product-list"]').should('be.visible');
    cy.get('[data-cy="product-item"]').should('have.length.at.least', 1);
    
    // Verificar contenido específico
    cy.contains('Producto Test 1').should('be.visible');
    cy.contains('$100.50').should('be.visible');
  });

  it('should create a new product', () => {
    // Navegar al formulario de creación
    cy.get('[data-cy="add-product-btn"]').click();
    
    // Llenar el formulario
    cy.get('[data-cy="product-name"]').type('Nuevo Producto Test');
    cy.get('[data-cy="product-price"]').type('250.00');
    cy.get('[data-cy="product-description"]').type('Descripción del nuevo producto');
    cy.get('[data-cy="product-category"]').select('Categoría A');
    
    // Enviar el formulario
    cy.get('[data-cy="submit-btn"]').click();
    
    // Verificar que la petición POST se realizó
    cy.wait('@createProduct').then((interception) => {
      expect(interception.request.body).to.include({
        name: 'Nuevo Producto Test',
        price: 250.00,
        description: 'Descripción del nuevo producto'
      });
    });
    
    // Verificar redirección o mensaje de éxito
    cy.get('[data-cy="success-message"]').should('contain', 'Producto creado exitosamente');
  });

  it('should update an existing product', () => {
    // Esperar a que se carguen los productos
    cy.wait('@getProducts');
    
    // Hacer clic en editar el primer producto
    cy.get('[data-cy="edit-product-btn"]').first().click();
    
    // Modificar campos
    cy.get('[data-cy="product-name"]').clear().type('Producto Modificado');
    cy.get('[data-cy="product-price"]').clear().type('350.00');
    
    // Guardar cambios
    cy.get('[data-cy="save-btn"]').click();
    
    // Verificar que la petición PUT se realizó
    cy.wait('@updateProduct').then((interception) => {
      expect(interception.request.body).to.include({
        name: 'Producto Modificado',
        price: 350.00
      });
    });
    
    // Verificar mensaje de éxito
    cy.get('[data-cy="success-message"]').should('contain', 'Producto actualizado');
  });

  it('should delete a product', () => {
    // Esperar a que se carguen los productos
    cy.wait('@getProducts');
    
    // Contar productos iniciales
    cy.get('[data-cy="product-item"]').its('length').then((initialCount) => {
      // Hacer clic en eliminar
      cy.get('[data-cy="delete-product-btn"]').first().click();
      
      // Confirmar eliminación
      cy.get('[data-cy="confirm-delete-btn"]').click();
      
      // Verificar que la petición DELETE se realizó
      cy.wait('@deleteProduct');
      
      // Verificar que el producto fue eliminado de la interfaz
      cy.get('[data-cy="success-message"]').should('contain', 'Producto eliminado');
    });
  });

  it('should handle API errors gracefully', () => {
    // Interceptar con error para probar manejo de errores
    cy.intercept('GET', 'http://localhost:8080/products', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('getProductsError');
    
    // Recargar la página
    cy.reload();
    
    // Verificar que se muestra mensaje de error
    cy.wait('@getProductsError');
    cy.get('[data-cy="error-message"]').should('contain', 'Error al cargar productos');
  });

  it('should search and filter products', () => {
    cy.wait('@getProducts');
    
    // Usar filtro de búsqueda
    cy.get('[data-cy="search-input"]').type('Test 1');
    
    // Verificar que solo aparezcan productos filtrados
    cy.get('[data-cy="product-item"]').should('have.length', 1);
    cy.contains('Producto Test 1').should('be.visible');
    cy.contains('Producto Test 2').should('not.exist');
  });
});