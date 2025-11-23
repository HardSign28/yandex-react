import { useGetIngredientsQuery } from '@/store/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { select } from '@/store/slices/selectedIngredientSlice';
import { useEffect, useMemo } from 'react';

import type { TIngredient, UseIngredientsByIdsResult } from '@utils/types';

export const useIngredientsByIds = (ids: string[]): UseIngredientsByIdsResult => {
  const dispatch = useAppDispatch();

  const items = useAppSelector((s) => s.ingredients.items);

  const map = useMemo(() => new Map(items.map((i) => [i._id, i])), [items]);

  const missingIds = ids.filter((id) => !map.has(id));

  const { data: fetchedData, isLoading } = useGetIngredientsQuery(undefined, {
    skip: missingIds.length === 0,
  });

  useEffect(() => {
    if (!fetchedData) return;

    fetchedData.forEach((ing: TIngredient) => {
      if (!map.has(ing._id)) {
        dispatch(select(ing));
      }
    });
  }, [fetchedData, map, dispatch]);

  const ingredients = useMemo(
    () => ids.map((id) => map.get(id)).filter(Boolean) as TIngredient[],
    [ids, map]
  );

  return { ingredients, loading: isLoading };
};
