import { FSA } from "flux-standard-action";
import { Middleware } from "redux";

export const errorHandler = <InputAction extends FSA<any>, OutputAction extends FSA<any>>(
  {
    /**
     * If specified, the error handler will only react to this action type.
     * Omit this to define a universal error handler.
     */
    inputType,
    /**
     * Map erroneous actions to actions of this type.
     */
    outputType,
    /**
     * Payload mapper
     */
    mapper
  }: {
    inputType?: InputAction["type"];
    outputType: OutputAction["type"];
    mapper: (payload: InputAction["payload"]) => OutputAction["payload"];
  }
): Middleware =>
  api => next => (action: InputAction) => {
    const result = next(action);

    if(action.error === true && (!inputType || action.type === inputType)) {
      try {
        api.dispatch({
          type: outputType,
          payload: mapper(action.payload)
        });
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
