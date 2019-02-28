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
    updateAllType,
    createType,
    updateType,
    removeType,
    defaultValue = []
  } : {
    id: (entity: Entity) => any;
    updateAllType?: UpdateAllAction["type"];
    createType?: CreateAction["type"];
    updateType?: UpdateAction["type"];
    removeType?: RemoveAction["type"];
    defaultValue?: Entity[];
  }
): Reducer<EntityListState<Entity>> => (
  state: EntityListState<Entity> = defaultValue,
  action: UpdateAllAction | CreateAction | UpdateAction | RemoveAction
) => {
  if(isError(action)) {
    return state;
  }
  if (updateAllType && action.type === updateAllType) {
    const updateAllAction = action as UpdateAllAction;
    if (updateAllAction.payload !== undefined) {
      // completely replace list
      return updateAllAction.payload;
    }
  }
  if (createType && action.type === createType) {
    const createAction = action as CreateAction;
    if(createAction.payload !== undefined) {
      // append newly created item to list
      return state.concat([createAction.payload]);
    }
  }
  if (updateType && action.type === updateType) {
    const updateAction = action as UpdateAction;
    if(updateAction.payload !== undefined) {
      const updatedItem = updateAction.payload;
      const updatedItemId = id(updatedItem);
      // update item in list
      return state.map(item =>
        id(item) === updatedItemId ? updatedItem : item
      );
    }
  }
  if (removeType && action.type === removeType) {
    const removeAction = action as RemoveAction;
    if (removeAction.payload !== undefined) {
      const removedItem = removeAction.payload;
      const removedItemId = id(removedItem);
      // filter out removed item
      return state.filter(item =>
        id(item) !== removedItemId
      );
    }
  }
  return state;
};
