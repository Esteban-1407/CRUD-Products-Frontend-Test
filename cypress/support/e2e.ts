// cypress/support/e2e.ts
// Import commands.ts using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configuración global para todas las pruebas
beforeEach(() => {
  // Configurar interceptores por defecto si es necesario
  cy.intercept('GET', '/api/**', { fixture: 'default-response.json' }).as('defaultAPI');
});

// Configuraciones adicionales de Cypress
Cypress.on('uncaught:exception', (err, runnable) => {
  // Evitar que errores de la aplicación fallen las pruebas
  // Solo en casos específicos donde esperamos ciertos errores
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});