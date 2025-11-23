import { SELECTORS } from './selectors.ts';
Cypress.Commands.add('getFirstIngredient', () => {
  return cy.get(SELECTORS.ingredientCard).first();
});
