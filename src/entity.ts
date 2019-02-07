import { FSA, isError } from "flux-standard-action";
import { Reducer } from "redux";

export type EntityState<Entity> = Entity | null;

export const entity = <
  Entity,
  UpdateAction extends FSA<Entity>,
  DeleteAction extends FSA<Entity> = FSA<Entity>
>(
  {
    updateType,
    removeType,
    defaultValue = null
  }: {
    updateType: UpdateAction["type"];
    removeType?: DeleteAction["type"];
    defaultValue?: Entity | null;
  }
): Reducer<EntityState<Entity>> => (
  state: EntityState<Entity> = defaultValue,
  action: UpdateAction | DeleteAction
) => {
    if (!isError(action)) {
      if (action.type === updateType) {
        return action.payload !== undefined ? action.payload : null;
      }
      if (removeType && action.type === removeType) {
        return null;
      }
    }

    return state;
  };
