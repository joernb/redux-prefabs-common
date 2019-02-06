import { FSA, isError } from "flux-standard-action";
import { Reducer } from "redux";

export type EntityState<Entity> = Entity | null;

export const entity = <
  Entity,
  UpdateAction extends FSA<Entity>,
  DeleteAction extends FSA<Entity> = FSA<Entity>
>(
  {
    update,
    remove,
    defaultValue = null
  } : {
    update: UpdateAction["type"];
    remove?: DeleteAction["type"];
    defaultValue?: Entity | null;
  }
): Reducer<EntityState<Entity>> => (
  state: EntityState<Entity> = defaultValue,
  action: UpdateAction | DeleteAction
) => {
  if(!isError(action)) {
    if(action.type === update) {
      return action.payload !== undefined ? action.payload : null;
    }
    if(remove && action.type === remove) {
      return null;
    }
  }

  return state;
};
