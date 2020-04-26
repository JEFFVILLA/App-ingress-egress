import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

export const setItems = createAction(
  '[IngresoEgreso Component] Set Items',
  props<{ items: IngresoEgreso[] }>()
);
export const unSetItems = createAction('[IngresoEgreso Component] UnSet Items');
