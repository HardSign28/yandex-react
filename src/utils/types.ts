import type { Location } from 'react-router-dom';

export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TIngredientProps = {
  ingredient: TIngredient;
  onClick?: () => void;
  count?: number;
};

export type TModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
  labelledById?: string;
  closeOnOverlay?: boolean;
  title?: string;
};

export type TModalOverlayProps = {
  children: React.ReactNode;
  onClose?: () => void;
  closeOnOverlay?: boolean;
};

export type TIngredientsGroupProps = {
  id?: string;
  title: string;
  group: TIngredient[];
  onItemClick?: (ingredient: TIngredient) => void;
  counts: Record<string, number>;
};

export const TABS = ['bun', 'main', 'sauce'] as const;
export type TIngredientType = (typeof TABS)[number];

export const TYPES: Record<TIngredientType, TIngredientType> = {
  bun: 'bun',
  main: 'main',
  sauce: 'sauce',
};

export const LABELS: Record<TIngredientType, string> = {
  bun: 'Булки',
  main: 'Начинки',
  sauce: 'Соусы',
};

export type TCollected = {
  canDrop: boolean;
};

export type TDragItem = {
  ingredient: TIngredient;
};

export type TOrderDetails = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};

export type TBurgerConstructorItemProps = {
  ingredient: TIngredient;
  index: number;
  moveIngredient: (from: number, to: number) => void;
  removeIngredient: (index: number) => void;
};

export type TSelectedState = {
  current: TIngredient | null;
};

export type TConstructorState = {
  bun: TIngredient | null;
  ingredients: (TIngredient & { uid: string })[];
};

export type TIngredientsState = {
  items: TIngredient[];
  error: string | null;
};

export type TOrderState = {
  last: TOrderDetails | null;
  error: string | null;
  isLoading: boolean;
};

export type TIngredientUid = TIngredient & {
  uid: string;
};

export type TLocationState = {
  background?: Location;
};

export type TAuthResponse = {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: { name: string; email: string };
  message?: string;
};

export type TIngredientsResponse = {
  success: boolean;
  data?: TIngredient[];
  message?: string;
};

export type TOrderResponse = { success: boolean } & TOrderDetails;
