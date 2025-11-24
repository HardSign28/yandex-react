import { SELECTORS } from './selectors.ts';
Cypress.Commands.add('getFirstIngredient', () => {
  return cy.get(SELECTORS.ingredientCard).first();
});

Cypress.Commands.add('drag', { prevSubject: 'element' }, (subject, toSelector) => {
  cy.wrap(subject).trigger('dragstart');
  cy.get(toSelector).trigger('drop');
});
