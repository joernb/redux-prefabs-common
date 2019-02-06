import { FSA, isError } from "flux-standard-action";
import { Reducer } from "redux";

export type EntityListState<Entity> = Entity[];

export const entityList = <
  Entity,
  UpdateAllAction extends FSA<Entity[]>,
  CreateAction extends FSA<Entity> = FSA<Entity>,
  UpdateAction extends FSA<Entity> = FSA<Entity>,
  RemoveAction extends FSA<Entity> = FSA<Entity>
>(
  {
    id,
    create,
    update,
    remove,
    updateAll,
    defaultValue = []
  } : {
    id: (entity: Entity) => any;
    updateAll: UpdateAllAction["type"];
    create?: CreateAction["type"];
    update?: UpdateAction["type"];
    remove?: RemoveAction["type"];
    defaultValue?: Entity[];
  }
): Reducer<EntityListState<Entity>> => (
  state: EntityListState<Entity> = defaultValue,
  action: UpdateAllAction | CreateAction | UpdateAction | RemoveAction
) => {
  if(isError(action)) {
    return state;
  }
  if (updateAll && action.type === updateAll) {
    const updateAllAction = action as UpdateAllAction;
    if (updateAllAction.payload !== undefined) {
      return updateAllAction.payload;
    }
  }
  if (create && action.type === create) {
    const createAction = action as CreateAction;
    if(createAction.payload !== undefined) {
      return state.concat([createAction.payload]);
    }
  }
  if (update && action.type === update) {
    const updateAction = action as UpdateAction;
    if(updateAction.payload !== undefined) {
      const updatedItem = updateAction.payload;
      const updatedItemId = id(updatedItem);
      return state.map(item =>
        id(item) === updatedItemId ? updatedItem : item
      );
    }
  }
  if (remove && action.type === remove) {
    const removeAction = action as RemoveAction;
    if (removeAction.payload !== undefined) {
      const removedItem = removeAction.payload;
      const removedItemId = id(removedItem);
      return state.filter(item =>
        id(item) !== removedItemId
      );
    }
  }
  return state;
};
