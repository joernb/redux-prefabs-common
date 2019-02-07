import { FSA } from "flux-standard-action";
import { Middleware } from "redux";

/**
 * Map one action type to another one with optional filtering.
 */
export const map = <
  InputAction extends FSA<any>,
  OutputAction extends FSA<any>
>(
  {
    inputType,
    outputType,
    map,
    mapMany,
    flatMap,
    flatMapMany,
  }: {
    inputType: InputAction["type"];
    outputType: OutputAction["type"];
    map?: (payload: InputAction["payload"]) => OutputAction["payload"];
    mapMany?: (payload: InputAction["payload"]) => Array<OutputAction["payload"]>;
    flatMap?: (payload: InputAction["payload"]) => OutputAction;
    flatMapMany?: (payload: InputAction["payload"]) => Array<OutputAction>;
  }
): Middleware =>
  api => next => (action: InputAction) => {
    const result = next(action);

    if(action.type === inputType && !action.error) {
      try {
        if(map) {
          api.dispatch({
            type: outputType,
            payload: map(action.payload)
          });
        }
        if(mapMany) {
          mapMany(action.payload).map(payload =>
            api.dispatch({
              type: outputType,
              payload
            })
          );
        }
        if(flatMap) {
          api.dispatch(flatMap(action.payload));
        }
        if(flatMapMany) {
          flatMapMany(action.payload).map(outputAction =>
            api.dispatch(outputAction)
          );
        }
      } catch(error) {
        api.dispatch({
          type: outputType,
          payload: error,
          error: true
        });
      }
    }

    return result;
  };
