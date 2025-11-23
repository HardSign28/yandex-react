describe('Burger Constructor flow', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          name: 'Test User',
          email: 'test@test.com'
        }
      }
    }).as('getUser');

    cy.intercept('POST', '**/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Тестовый заказ',
        order: { number: 12345 },
      },
    }).as('makeOrder');

    //
    // ТУТ ВАЖНО: кладём оба токена
    //
    window.localStorage.setItem('accessToken', 'test-access');
    window.localStorage.setItem('refreshToken', 'test-refresh');

    cy.visit('http://localhost:5173/');

    cy.wait('@getIngredients');
    cy.wait('@getUser'); // теперь будет вызываться
  });


  it('может собрать заказ и открыть модалку заказа', () => {
    // Перетягиваем булку
    cy.get('[data-testid="ingredient-card"][data-type="bun"]')
      .first()
      .trigger('dragstart');

    cy.get('[data-testid="drop-bun-top"]').trigger('drop');

    // Перетягиваем начинку
    cy.get(
      '[data-testid="ingredient-card"][data-type="main"],[data-testid="ingredient-card"][data-type="sauce"]'
    )
      .first()
      .trigger('dragstart');

    cy.get('[data-testid="drop-ingredients"]').trigger('drop');

    // Нажимаем "Оформить заказ"
    cy.get('[data-testid="order-button"]').click();

    // Ждём запрос
    cy.wait('@makeOrder');

    // Проверяем открытие модалки заказа
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="modal"]').contains('12345');
  });
});
