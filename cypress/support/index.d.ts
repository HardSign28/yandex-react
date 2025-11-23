declare namespace Cypress {
  interface Chainable {
    getFirstIngredient(): Chainable<JQuery<HTMLElement>>;
  }
}


