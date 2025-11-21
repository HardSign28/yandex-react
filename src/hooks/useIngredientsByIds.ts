import { useGetIngredientsQuery } from '@/store/api';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { select } from '@/store/slices/selectedIngredientSlice';
import { useEffect, useMemo } from 'react';

import type { TIngredient } from '@utils/types';

type useIngredientsByIdsResult = {
  ingredients: TIngredient[];
  loading: boolean;
};

export const useIngredientsByIds = (ids: string[]): useIngredientsByIdsResult => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector((s) => s.ingredients?.items ?? []);

  const missingIds = ids.filter((id) => !ingredients.find((it) => it._id === id));

  const needFetch = missingIds.length > 0;

  const { data: fetchedData, isLoading: isFetching } = useGetIngredientsQuery(
    undefined,
    { skip: !needFetch }
  );

  useEffect(() => {
    if (!fetchedData || !Array.isArray(fetchedData)) return;

    fetchedData.forEach((ing: TIngredient) => {
      if (!ingredients.find((i) => i._id === ing._id)) {
        dispatch(select(ing)); // или отдельный slice для всех ингредиентов
      }
    });
  }, [fetchedData, ingredients, dispatch]);

  const result = useMemo(
    () =>
      ids
        .map((id) => ingredients.find((i) => i._id === id))
        .filter(Boolean) as TIngredient[],
    [ids, ingredients]
  );

  return { ingredients: result, loading: isFetching };
};
