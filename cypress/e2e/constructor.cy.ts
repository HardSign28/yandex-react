import { SELECTORS } from '../support/selectors';

describe('Burger Constructor flow', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', {
      fixture: 'ingredients.json',
    }).as('getIngredients');

    cy.intercept('GET', '**/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          name: 'Test User',
          email: 'test@test.com',
        },
      },
    }).as('getUser');

    cy.intercept('POST', '**/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Тестовый заказ',
        order: { number: 12345 },
      },
    }).as('makeOrder');

    window.localStorage.setItem('accessToken', 'test-access');
    window.localStorage.setItem('refreshToken', 'test-refresh');

    cy.visit('/');

    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  it('может собрать заказ и открыть модалку заказа', () => {
    cy.get(SELECTORS.ingredientCard).first().as('ingredientCard');

    cy.getFirstIngredient().click();

    cy.get(SELECTORS.modal).as('Modal').should('exist');

    cy.get('@ingredientCard')
      .find(SELECTORS.ingredientName)
      .invoke('text')
      .then((ingredientName) => {
        cy.get(SELECTORS.modalIngredientName)
          .invoke('text')
          .should('contain', ingredientName.trim());
      });

    cy.get('[data-testid="ingredient-calories"]').should('exist');
    cy.get('[data-testid="ingredient-proteins"]').should('exist');
    cy.get('[data-testid="ingredient-fat"]').should('exist');
    cy.get('[data-testid="ingredient-carbohydrates"]').should('exist');

    cy.get(SELECTORS.modalClose).click();
    cy.get('@Modal').should('not.exist');

    cy.getFirstIngredient().drag(SELECTORS.bunTop);

    cy.get('[data-testid="ingredient-card"][data-type="main"]').drag(
      SELECTORS.dropIngredients
    );

    cy.get(SELECTORS.orderButton).click();

    cy.wait('@makeOrder');

    cy.get('@Modal').should('exist');
    cy.get('@Modal').contains('12345');
  });
});
