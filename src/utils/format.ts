import type { TIngredient } from '@utils/types';

export const formatThousands = (num: number): string =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

type groupIngredientsObjectsReturn = {
  ingredient: TIngredient;
  count: number;
  total: number;
};

export const groupIngredientsObjects = (
  ingredients: TIngredient[]
): groupIngredientsObjectsReturn[] => {
  const map = new Map<
    string,
    { ingredient: TIngredient; count: number; total: number }
  >();

  ingredients.forEach((ing) => {
    if (!map.has(ing._id)) {
      map.set(ing._id, {
        ingredient: ing,
        count: 1,
        total: ing.price,
      });
    } else {
      const item = map.get(ing._id)!;
      item.count += 1;
      item.total = item.count * ing.price;
    }
  });

  return Array.from(map.values());
};
