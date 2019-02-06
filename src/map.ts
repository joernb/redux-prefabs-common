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
    filter,
    mapper,
  }: {
    inputType: InputAction["type"];
    outputType: OutputAction["type"];
    filter?: (payload: InputAction["payload"]) => boolean;
    mapper: (payload: InputAction["payload"]) => OutputAction["payload"];
  }
): Middleware =>
  api => next => (action: InputAction) => {
    const result = next(action);

    if(action.type === inputType && !action.error) {
      try {
        const filterResult = filter ? filter(action.payload) : true;
        if (filterResult === true) {
          const mapped = mapper(filterResult);
          api.dispatch({
            type: outputType,
            payload: mapped
          });
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
