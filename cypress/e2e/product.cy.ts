describe('Gestión de Productos', () => {
  const nombre = 'Café Especial';
  const descripcion = 'Granos seleccionados';
  const precio = 18000;

  beforeEach(() => {
    cy.visit('http://localhost:4200'); 
  });

  it('Crea un producto y lo muestra en la tabla', () => {
    cy.get('input[placeholder="Name"]').type(nombre);
    cy.get('input[placeholder="Description"]').type(descripcion);
    cy.get('input[placeholder="Price"]').type(precio.toString());

    cy.get('button[type="submit"]').click();
    cy.wait(1000)

    cy.contains('td', nombre).should('exist');
    cy.contains('td', descripcion).should('exist');
    cy.contains('td', precio).should('exist');
  });
});
