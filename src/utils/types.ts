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

export type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  counts: Record<string, number>;
};

export type TIngredientProps = {
  ingredient: TIngredient;
  onClick?: () => void;
  count?: number;
};

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
  labelledById?: string;
  closeOnOverlay?: boolean;
  title?: string;
};

export type ModalOverlayProps = {
  children: React.ReactNode;
  onClose?: () => void;
  closeOnOverlay?: boolean;
};

export type State = {
  productData: TIngredient[];
  loading: boolean;
  error?: string | null;
};

export type IngredientsResponse = {
  success: boolean;
  data?: TIngredient[];
};

export type TIngredientsGroupProps = {
  id?: string;
  title: string;
  group: TIngredient[];
  onItemClick?: (ingredient: TIngredient) => void;
  counts: Record<string, number>;
};

export const TABS = ['bun', 'main', 'sauce'] as const;
export type IngredientType = (typeof TABS)[number];

export const TYPES: Record<IngredientType, IngredientType> = {
  bun: 'bun',
  main: 'main',
  sauce: 'sauce',
};

export const LABELS: Record<IngredientType, string> = {
  bun: 'Булки',
  main: 'Начинки',
  sauce: 'Соусы',
};

export type Collected = {
  canDrop: boolean;
};

export type DragItem = {
  ingredient: TIngredient;
};

export type TOrderDetails = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};

export type BurgerConstructorItemProps = {
  ingredient: TIngredient;
  index: number;
  moveIngredient: (from: number, to: number) => void;
  removeIngredient: (index: number) => void;
};
