declare namespace Cypress {
  interface Chainable {
    getFirstIngredient(): Chainable<JQuery<HTMLElement>>;
  }
}

declare namespace Cypress {
  interface Chainable {
    /**
     * Перетаскивает элемент на целевой селектор
     * @param toSelector CSS селектор drop зоны
     */
    drag(toSelector: string): Chainable<JQuery<HTMLElement>>;
  }
}


