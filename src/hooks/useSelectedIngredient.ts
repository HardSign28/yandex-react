import { useGetIngredientsQuery } from '@/store/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { select } from '@/store/slices/selectedIngredientSlice';
import { useEffect, useMemo } from 'react';
import { useMatch } from 'react-router-dom';

import type { TIngredient } from '@utils/types';

type UseSelectedIngredientResult = {
  ingredient: TIngredient | null;
  loading: boolean;
};

export const useSelectedIngredient = (): UseSelectedIngredientResult => {
  const dispatch = useAppDispatch();

  const selected = useAppSelector((s) => s.selectedIngredient.current);
  const ingredients = useAppSelector((s) => s.ingredients?.items ?? []);
  const match = useMatch('/ingredients/:ingredientId');
  const ingredientId = match?.params.ingredientId ?? null;

  const needFetch = Boolean(
    ingredientId && !selected && !ingredients.find((it) => it._id === ingredientId)
  );
  const { data: fetchedData, isLoading: isFetching } = useGetIngredientsQuery(
    undefined,
    {
      skip: !needFetch,
    }
  );

  useEffect(() => {
    if (!ingredientId) return;
    if (selected && selected._id === ingredientId) return;

    const foundInStore = ingredients.find((it) => it._id === ingredientId);
    if (foundInStore) {
      dispatch(select(foundInStore));
    }
  }, [ingredientId, ingredients, selected, dispatch]);

  useEffect(() => {
    if (!ingredientId) return;
    if (selected && selected._id === ingredientId) return;
    if (!fetchedData || !Array.isArray(fetchedData)) return;

    const found = fetchedData.find((it: TIngredient) => it._id === ingredientId);
    if (found) {
      dispatch(select(found));
    }
  }, [ingredientId, fetchedData, selected, dispatch]);

  const loading = isFetching;

  return useMemo(
    () => ({
      ingredient: selected,
      loading,
    }),
    [selected, loading]
  );
};
